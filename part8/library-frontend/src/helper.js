import { ALL_AUTHORS, ALL_BOOKS, BOOKS_BY_GENRE } from './queries';

export const updateCache = (cache, newBook) => {
  console.log(newBook);
  const hasId = (cacheArray, newObject) => {
    return cacheArray.some((object) => object.id === newObject.id);
  };

  const allBooksCache = cache.readQuery({ query: ALL_BOOKS });
  if (allBooksCache && !hasId(allBooksCache.allBooks, newBook)) {
    cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      return {
        allBooks: allBooks.concat(newBook)
      };
    });
  }

  for (const genre of newBook.genres) {
    const variables = { genre };
    const booksByGenreCache = cache.readQuery({
      query: BOOKS_BY_GENRE,
      variables
    });

    if (booksByGenreCache && !hasId(booksByGenreCache.allBooks, newBook)) {
      cache.updateQuery(
        { query: BOOKS_BY_GENRE, variables },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(newBook)
          };
        }
      );
    }
  }

  const allAuthorsCache = cache.readQuery({ query: ALL_AUTHORS });
  const newBookAuthor = newBook.author;
  if (allAuthorsCache && !hasId(allAuthorsCache.allAuthors, newBookAuthor)) {
    cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
      return {
        allAuthors: allAuthors.concat(newBookAuthor)
      };
    });
  }
};
