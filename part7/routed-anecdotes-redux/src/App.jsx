import { useState } from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';

import Menu from './components/Menu';
import Notification from './components/Notification';
import AnecdoteDetail from './components/AnecdoteDetail';
import AnecdoteList from './components/AnecdoteList';
import About from './components/About';
import Footer from './components/Footer';
import CreateNew from './components/CreateNew';

const App = () => {
  const dispatch = useDispatch();
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ]);

  const match = useMatch('/:id');

  const anecdote = match
    ? anecdotes.find((a) => a.id === Number(match.params.id))
    : null;

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));

    const type = 'info';
    const message = `new anecdote '${anecdote.content}' created!`;
    dispatch(setNotification({ type, message }));
  };

  // const anecdoteById = (id) =>
  //   anecdotes.find(a => a.id === id)

  // const vote = (id) => {
  //   const anecdote = anecdoteById(id)

  //   const voted = {
  //     ...anecdote,
  //     votes: anecdote.votes + 1
  //   }

  //   setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  // }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification />

      <Routes>
        <Route path="/:id" element={<AnecdoteDetail anecdote={anecdote} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
