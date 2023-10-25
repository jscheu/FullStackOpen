import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { addBlog } from '../reducers/blogsReducer';
import blogService from '../services/blogs';

const BlogForm = ({ onCreateBlog }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.activeUser.token);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  console.log('blog form render');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = {
      title,
      author,
      url,
    };

    try {
      const response = await blogService.create({ token, content });
      setTitle('');
      setAuthor('');
      setUrl('');

      const blog = response.data;
      dispatch(addBlog(blog));
      onCreateBlog();

      const type = 'info';
      const message = `new blog ${blog.title} by ${blog.author} added`;
      dispatch(setNotification({ type, message }));
    } catch (e) {
      const type = 'error';
      const message = `error creating blog: ${e.message}`;
      dispatch(setNotification({ type, message }));
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='title'
            placeholder='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='author'
            placeholder='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='url'
            placeholder='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
