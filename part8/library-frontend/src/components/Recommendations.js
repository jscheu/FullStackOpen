import { useLazyQuery, useQuery } from '@apollo/client';
import { BOOKS_BY_GENRE, FAVORITE_GENRE } from '../queries';
import { useEffect } from 'react';

const Recommendations = ({ show }) => {
  const [loadBooksByGenre, { loading: booksLoading, data: booksData }] =
    useLazyQuery(BOOKS_BY_GENRE);
  const { loading: genreLoading, data: genreData } = useQuery(FAVORITE_GENRE);

  useEffect(() => {
    if (genreData) {
      loadBooksByGenre({ variables: { genre: genreData.me.favoriteGenre } });
    }
  }, [genreData, loadBooksByGenre]);

  if (!show) return null;

  if (genreLoading || booksLoading) return <div>loading...</div>;

  return (
    <div>
      <h2>recommendations</h2>
      {genreData && (
        <div>
          books in your favorite genre{' '}
          <strong>{genreData.me.favoriteGenre}</strong>
        </div>
      )}
      {booksData && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {booksData.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Recommendations;
