import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { setNotification } from '../reducers/notificationReducer';
import { setBlogs } from '../reducers/blogsReducer';

import blogService from '../services/blogs';

import BlogListView from '../views/BlogsListView';
import BlogDetail from '../components/BlogDetail';

const BlogsView = () => {
  const dispatch = useDispatch();

  const sortByLikes = (unsortedBlogs) => {
    const sortedBlogs = unsortedBlogs.sort((a, b) => b.likes - a.likes);
    return sortedBlogs;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(sortByLikes(blogs)));
      } catch (e) {
        const type = 'warning';
        const message = `error fetching blogs: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <Routes>
        <Route path='/' element={<BlogListView />} />
        <Route path='/blogs/:id' element={<BlogDetail />} />
      </Routes>
    </div>
  );
};

export default BlogsView;
