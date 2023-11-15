import { useCallback, useEffect, useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
import { BOOK_ADDED } from './queries';
import { updateCache } from './helper';

const App = () => {
  const [token, setToken] = useState(null);
  const [loginState, setLoginState] = useState(false);
  const [page, setPage] = useState('authors');
  const client = useApolloClient();

  const handleLoginState = () => {
    if (token) {
      setToken(null);
      setLoginState(false);
      localStorage.clear();
      client.resetStore();
    } else {
      setPage('login');
    }
  };

  const onLoginSuccess = useCallback((returnedToken) => {
    setToken(returnedToken);
    setLoginState(true);
    setPage('authors');
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('libraryapp-user-token');
    if (savedToken) {
      setToken(savedToken);
      setLoginState(true);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      updateCache(client.cache, addedBook);
      window.alert(`${addedBook.title} added`);
    }
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loginState && <button onClick={() => setPage('add')}>add book</button>}
        {loginState && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        <button onClick={handleLoginState}>
          {loginState ? 'logout' : 'login'}
        </button>
      </div>

      <Authors loggedIn={loginState} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommend'} />

      <LoginForm onLoginSuccess={onLoginSuccess} show={page === 'login'} />
    </div>
  );
};

export default App;
