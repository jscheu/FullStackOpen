import { useSelector } from 'react-redux';

import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  console.log('blog list render');

  return (
    <Table striped>
      <tbody>
        {blogs.map((blog) => (
          <tr key={blog.id}>
            <td key={`${blog.id}-title`}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </td>
            <td key={`${blog.id}-author`}>by {blog.author}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BlogList;
