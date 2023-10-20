import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import loginService from '../services/login';

const LoginForm = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  console.log('login form render');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userLogin = await loginService.login({
        username,
        password,
      });
      const type = 'info';
      const message = `logged in as ${userLogin.name}`;
      dispatch(setNotification({ type, message }));
      onLoginSuccess(userLogin);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        const type = 'error';
        const message = 'wrong username or password';
        dispatch(setNotification({ type, message }));
      } else {
        const type = 'error';
        const message = `error: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    }
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type='test'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
