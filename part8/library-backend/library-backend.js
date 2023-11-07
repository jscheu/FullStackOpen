const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');

mongoose.set('strictQuery', false);

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('error connectinge to MongoDB:', error.message);
  }
};

console.log('connecting to', MONGODB_URI);
connectToDatabase(MONGODB_URI);

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => {
      const count = await Book.collection.countDocuments();
      return count;
    },
    allBooks: async (root, args) => {
      const query = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) query.author = author._id;
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      const books = await Book.find(query).populate('author');
      return books;
    },
    authorCount: async () => {
      const count = await Author.collection.countDocuments();
      return count;
    },
    allAuthors: async () => {
      const collection = await Author.find({});
      return collection;
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          if (error.name === 'ValidationError') {
            throw new GraphQLError('Saving author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            });
          }
          throw new GraphQLError('Error saving author: ' + error.message);
        }
      }

      const book = new Book({ ...args, author });
      try {
        await book.save();
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          });
        }
        throw new GraphQLError('Error saving book: ' + error.message);
      }

      return book;
    },
    editAuthor: async (root, args) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;
      await author.save();

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      try {
        user.save();
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Saving user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.useranme,
              error
            }
          });
        }
        throw new GraphQLError('Error saving user: ' + error.message);
      }

      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    }
  },
  Author: {
    bookCount: (root) => {
      const count = Book.collection.countDocuments({ author: root._id });
      return count;
    }
  }
};

const startServer = async (server) => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          );
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      }
    });
    console.log(`Server ready at ${url}`);
  } catch (error) {
    console.log('Error starting server:', error);
  }
};

startServer(new ApolloServer({ typeDefs, resolvers }));
