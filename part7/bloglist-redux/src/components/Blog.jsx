import { useState } from 'react';
import { useSelector } from 'react-redux';

const Blog = ({ blog, onLikeClick, onRemoveClick }) => {
  const user = useSelector((state) => state.user);
  const [details, setDetails] = useState(false);

  const buttonText = details ? 'hide' : 'view';

  const showDetails = { display: details ? '' : 'none' };

  const toggleDetails = () => {
    setDetails(!details);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleDetails}>{buttonText}</button>
      </div>
      <div style={showDetails} className='blog-details'>
        <div>{blog.url}</div>
        <div>
          likes: {blog.likes}
          <button onClick={() => onLikeClick(blog.id)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && (
          <button onClick={() => onRemoveClick(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
