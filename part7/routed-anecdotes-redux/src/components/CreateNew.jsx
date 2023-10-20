import PropTypes from 'prop-types';
import { useField } from '../hooks';
import { useNavigate } from 'react-router-dom';

const CreateNew = (props) => {
  const { field: contentField, reset: resetContent } = useField(
    'text',
    'content',
  );
  const { field: authorField, reset: resetAuthor } = useField('text', 'author');
  const { field: infoField, reset: resetInfo } = useField('text', 'info');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0,
    });
    navigate('/');
  };

  const handleReset = (e) => {
    e.preventDefault();
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentField} />
        </div>
        <div>
          author
          <input {...authorField} />
        </div>
        <div>
          url for more info
          <input {...infoField} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired,
};

export default CreateNew;
