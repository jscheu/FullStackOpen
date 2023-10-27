import { useRef } from 'react';

import Toggleable from '../components/Toggleable';
import BlogForm from '../components/BlogForm';
import BlogList from '../components/BlogList';

const BlogListView = () => {
  const blogFormRef = useRef(null);

  const onCreateBlog = () => {
    if (blogFormRef.current) blogFormRef.current.toggleVisibility();
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Toggleable buttonLabel='+ new blog' ref={blogFormRef}>
        <BlogForm onCreateBlog={onCreateBlog} />
      </Toggleable>
      <BlogList />
    </div>
  );
};

export default BlogListView;
