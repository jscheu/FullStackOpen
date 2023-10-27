import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { addBlog } from '../reducers/blogsReducer';
import blogService from '../services/blogs';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

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

      const type = 'success';
      const message = `new blog ${blog.title} by ${blog.author} added`;
      dispatch(setNotification({ type, message }));
    } catch (e) {
      const type = 'warning';
      const message = `error creating blog: ${e.message}`;
      dispatch(setNotification({ type, message }));
    }
  };

  return (
    <Container>
      <h3>Add a New Blog</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={8}>
            <Form.Control
              type='text'
              value={title}
              placeholder='title'
              name='title'
              onChange={({ target }) => setTitle(target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            <Form.Control
              type='text'
              value={author}
              placeholder='author'
              name='author'
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            <Form.Control
              type='text'
              value={url}
              placeholder='url'
              name='url'
              onChange={({ target }) => setUrl(target.value)}
            />
          </Col>
          <Col>
            <Button type='submit' variant='outline-primary'>
              create
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default BlogForm;
