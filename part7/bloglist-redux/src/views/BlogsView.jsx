import { useRef } from 'react';

import Toggleable from '../components/Toggleable';
import BlogForm from '../components/BlogForm';
import BlogList from '../components/BlogList';

const BlogsView = () => {
  const blogFormRef = useRef(null);

  const onCreateBlog = () => {
    if (blogFormRef.current) blogFormRef.current.toggleVisibility();
  };

  return (
    <div>
      <Toggleable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm onCreateBlog={onCreateBlog} />
      </Toggleable>
      <BlogList />
    </div>
  );
};

export default BlogsView;
