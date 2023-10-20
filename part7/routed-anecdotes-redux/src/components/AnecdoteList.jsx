import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

AnecdoteList.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      author: PropTypes.string,
      info: PropTypes.string,
      votes: PropTypes.number,
      id: PropTypes.number,
    }),
  ),
};

export default AnecdoteList;
