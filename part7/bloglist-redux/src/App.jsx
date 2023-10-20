import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';

import Notification from './components/Notification';
import Toggleable from './components/Toggleable';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';

import './app.css';

const App = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [latestBlog, setLatestBlog] = useState(null);

  const blogFormRef = useRef(null);

  console.log('app render');

  const onLoginSuccess = (userLogin) => {
    window.localStorage.setItem(
      'loggedBloglistUser',
      JSON.stringify(userLogin),
    );
    setUser(userLogin);
  };

  const handleLogout = () => {
    const name = user.name;
    window.localStorage.removeItem('loggedBloglistUser');
    setUser(null);

    const type = 'info';
    const message = `${name} successfully logged out`;
    dispatch(setNotification({ type, message }));
  };

  const onCreateBlog = (blog) => {
    setLatestBlog(blog);
    if (blogFormRef.current) blogFormRef.current.toggleVisibility();
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON);
      setUser(userLogin);

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
      <Toggleable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm token={user.token} onCreateBlog={onCreateBlog} />
      </Toggleable>
      <BlogList newBlog={latestBlog} user={user} />
    </div>
  );
};

export default App;
