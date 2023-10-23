import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { setBlogs, updateBlog, removeBlogById } from '../reducers/blogsReducer';
import PropTypes from 'prop-types';
import Blog from './Blog';
import blogService from '../services/blogs';

const BlogList = ({ newBlog, user }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const sortByLikes = (unsortedBlogs) => {
    const sortedBlogs = unsortedBlogs.sort((a, b) => b.likes - a.likes);
    return sortedBlogs;
  };

  const handleLikeClick = async (blogId) => {
    try {
      const response = await blogService.like({
        token: user.token,
        id: blogId,
      });

      if (response.status === 200) {
        const updatedBlog = response.data;
        dispatch(updateBlog(updatedBlog))

        const type = 'info';
        const message = `you liked "${updatedBlog.title}"`;
        dispatch(setNotification({ type, message }));
      }
    } catch (e) {
      const type = 'error';
      const message = `error: ${e.message}`;
      dispatch(setNotification({ type, message }));
    }
  };

  const handleRemoveClick = async (blog) => {
    const confirmed = window.confirm(
      `remove "${blog.title}" by ${blog.author}?`,
    );

    if (confirmed) {
      console.log(user.token);
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
  };

  console.log('blog list render');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(sortByLikes(blogs)));
      } catch (e) {
        const type = 'error';
        const message = `error fetching blogs: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (newBlog) dispatch(addBlog(newBlog))
  }, [newBlog]);

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLikeClick={handleLikeClick}
          onRemoveClick={handleRemoveClick}
        />
      ))}
    </div>
  );
};

BlogList.propTypes = {
  newBlog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }),
};

export default BlogList;
