const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');

const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');

const pubsub = new PubSub();

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
      const authorsWithBookCount = await Author.aggregate([
        {
          $lookup: {
            from: 'books', // The name of the collection to join.
            localField: '_id', // The field from the authors collection.
            foreignField: 'author', // The field from the books collection.
            as: 'books' // The array field to add to each author.
          }
        },
        {
          $project: {
            id: '$_id',
            name: 1, // Include other author fields as needed.
            born: 1,
            bookCount: { $size: '$books' } // Count the number of books for each author.
          }
        }
      ]);

      return authorsWithBookCount;
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

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
};

module.exports = resolvers;
