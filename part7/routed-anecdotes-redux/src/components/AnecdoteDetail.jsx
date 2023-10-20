import PropTypes from 'prop-types';

const AnecdoteDetail = ({ anecdote }) => {
  if (!anecdote) return <h2>404 anecdote not found</h2>;

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </div>
  );
};

AnecdoteDetail.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string,
    author: PropTypes.string,
    info: PropTypes.string,
    votes: PropTypes.number,
    id: PropTypes.number,
  }),
};

export default AnecdoteDetail;
