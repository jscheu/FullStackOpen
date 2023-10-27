import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { setActiveUser } from './reducers/activeUserReducer';
import { Route, Routes } from 'react-router-dom';

import Notification from './components/Notification';
import LoginForm from './components/LoginForm';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import BlogsView from './views/BlogsView';
import UsersView from './views/UsersView';
import NavigationBar from './components/NavigationBar';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.activeUser);

  console.log('app render');

  const onLoginSuccess = (userLogin) => {
    window.localStorage.setItem(
      'loggedBloglistUser',
      JSON.stringify(userLogin),
    );
    dispatch(setActiveUser(userLogin));
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON);
      dispatch(setActiveUser(userLogin));

      const type = 'info';
      const message = `logged in as ${userLogin.name}`;
      dispatch(setNotification({ type, message }));
    }
  }, []);

  if (user === null) {
    return (
      <Container>
        <Notification />
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </Container>
    );
  }

  return (
    <Container>
      <Notification />
      <NavigationBar />
      <Routes>
        <Route path='*' element={<BlogsView />} />
        <Route path='/users/*' element={<UsersView />} />
      </Routes>
    </Container>
  );
};

export default App;
