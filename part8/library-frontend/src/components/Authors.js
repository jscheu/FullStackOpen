import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries';
import { useState } from 'react';

import Select from 'react-select';

const Authors = (props) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const result = useQuery(ALL_AUTHORS);

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    onError: (error) => {
      console.log(error);
    }
  });

  const submit = (event) => {
    event.preventDefault();

    const setBornTo = parseInt(born);

    updateAuthor({
      variables: { name, setBornTo }
    });

    setName('');
    setBorn('');
  };

  if (!props.show) {
    return null;
  }

  if (result.loading) return <div>loading...</div>;

  const authors = result.data.allAuthors;
  const selectNames = authors.map((a) => ({ value: a.id, label: a.name }));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.loggedIn /*display only if token is present*/ && (
        <div>
          <h3>set birthyear</h3>
          <form onSubmit={submit}>
            <Select
              options={selectNames}
              onChange={({ label }) => setName(label)}
            />
            <div>
              born{' '}
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
