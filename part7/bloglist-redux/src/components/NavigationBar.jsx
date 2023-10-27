import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { setNotification } from '../reducers/notificationReducer';
import { setActiveUser } from '../reducers/activeUserReducer';

import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';

const NavigationBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.activeUser);

  const handleLogout = () => {
    const name = user.name;
    window.localStorage.removeItem('loggedBloglistUser');
    dispatch(setActiveUser(null));

    const type = 'info';
    const message = `${name} successfully logged out`;
    dispatch(setNotification({ type, message }));
  };

  if (!user) return null;

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container>
        <Navbar.Brand>Blogs App</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/'>
              blogs
            </Nav.Link>
            <Nav.Link as={Link} to='/users'>
              users
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Row>
          <Col>
            <Navbar.Text>
              Signed in as: <strong>{user.name}</strong>
            </Navbar.Text>
          </Col>
          <Col>
            <Button variant='outline-primary' onClick={handleLogout}>
              logout
            </Button>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
