import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { setNotification } from '../reducers/notificationReducer';
import { updateBlog } from '../reducers/blogsReducer';

import blogService from '../services/blogs';

const BlogDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((state) => state.activeUser);
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id === id);
  const [commentText, setCommenText] = useState('');

  const handleLikeClick = async () => {
    if (!user) {
      const type = 'danger';
      const message = 'must log in to like blogs';
      dispatch(setNotification({ type, message }));
    } else {
      try {
        const response = await blogService.like({
          token: user.token,
          id: blog.id,
        });

        if (response.status === 200) {
          const updatedBlog = response.data;
          dispatch(updateBlog(updatedBlog));

          const type = 'success';
          const message = `you liked "${updatedBlog.title}"`;
          dispatch(setNotification({ type, message }));
        }
      } catch (e) {
        const type = 'warning';
        const message = `error: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    }
  };

  /* implement remove functionality if needed

  const handleRemoveClick = async (blog) => {
    const confirmed = window.confirm(
      `remove "${blog.title}" by ${blog.author}?`,
    );

    if (confirmed) {
      try {
        const response = await blogService.remove({
          token: user.token,
          id: blog.id,
        });

        if (response.status === 204) {
          dispatch(removeBlogById(blog.id));
          const type = 'info';
          const message = `removed "${blog.title}" by ${blog.author}`;
          dispatch(setNotification({ type, message }));
        } else {
          const type = 'error';
          const message = `error removing blog: status ${response.status}`;
          dispatch(setNotification({ type, message }));
        }
      } catch (e) {
        const type = 'error';
        const message = `error removing blog: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    }
  }; */

  const submitComment = async (event) => {
    event.preventDefault();

    if (!user) {
      const type = 'danger';
      const message = 'must log in to comment';
      dispatch(setNotification({ type, message }));
    } else {
      try {
        const data = {
          token: user.token,
          id: blog.id,
          content: commentText,
        };

        const response = await blogService.comment(data);

        if (response.status === 201) {
          const createdComment = {
            content: response.data.content,
            id: response.data.id,
          };
          const updatedBlog = {
            ...blog,
            comments: blog.comments.concat(createdComment),
          };
          dispatch(updateBlog(updatedBlog));

          setCommenText('');

          const type = 'success';
          const message = `you commented "${createdComment.content}"`;
          dispatch(setNotification({ type, message }));
        }
      } catch (e) {
        const type = 'warning';
        const message = `error: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    }
  };

  if (!blog) {
    return (
      <div>
        <h2>blog not found</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes <button onClick={handleLikeClick}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <form onSubmit={submitComment}>
        <div>
          <input
            type='text'
            value={commentText}
            name='comment'
            placeholder='comment'
            onChange={({ target }) => setCommenText(target.value)}
          />
          <button type='submit'>add comment</button>
        </div>
      </form>
      {blog.comments.length > 0 ? (
        <div>
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment.content}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>no comments added yet</p>
      )}
    </div>
  );
};

export default BlogDetail;
