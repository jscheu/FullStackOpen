import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { setActiveUser } from './reducers/activeUserReducer';
import { Route, Routes } from 'react-router-dom';

import Notification from './components/Notification';
import LoginForm from './components/LoginForm';

import './app.css';
import BlogsView from './views/BlogsView';
import UsersView from './views/UsersView';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.activeUser);

  console.log('app render');

  const onLoginSuccess = (userLogin) => {
    window.localStorage.setItem(
      'loggedBloglistUser',
      JSON.stringify(userLogin),
    );
    setActiveUser(userLogin);
  };

  const handleLogout = () => {
    const name = user.name;
    window.localStorage.removeItem('loggedBloglistUser');
    dispatch(setActiveUser(null));

    const type = 'info';
    const message = `${name} successfully logged out`;
    dispatch(setNotification({ type, message }));
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
      <div>
        <Notification />
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    );
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button id='logout-button' name='logout' onClick={handleLogout}>
          logout
        </button>
      </p>
      <Routes>
        <Route path='/' element={<BlogsView />} />
        <Route path='/users' element={<UsersView />} />
      </Routes>
    </div>
  );
};

export default App;
