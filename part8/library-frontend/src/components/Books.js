import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries';
import { useEffect, useState } from 'react';

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [loadAllBooks, { loading: loadingAll, data: dataAll }] =
    useLazyQuery(ALL_BOOKS);
  const [loadBooksByGenre, { loading: loadingGenre, data: dataGenre }] =
    useLazyQuery(BOOKS_BY_GENRE);

  const loadQuery =
    selectedGenre === 'all genres' ? loadAllBooks : loadBooksByGenre;
  const loading = selectedGenre === 'all genres' ? loadingAll : loadingGenre;
  //const data = selectedGenre === 'all genres' ? dataAll : dataGenre;

  const genres = [
    'refactoring',
    'agile',
    'patterns',
    'design',
    'crime',
    'classic',
    'revolution',
    'all genres'
  ];

  useEffect(() => {
    if (selectedGenre) {
      const variables =
        selectedGenre === 'all genres' ? {} : { genre: selectedGenre };
      loadQuery({ variables });
      console.log('query is being performed');
    }
  }, [loadQuery, selectedGenre]);

  if (!props.show) {
    return null;
  }

  if (loading) return <div>loading...</div>;

  const booksData =
    selectedGenre === 'all genres' ? dataAll?.allBooks : dataGenre?.allBooks;

  return (
    <div>
      <h2>books</h2>

      {!selectedGenre && <div>select a genre</div>}

      {booksData && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {booksData.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {genres.map((g) => (
        <button key={g} onClick={() => setSelectedGenre(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
