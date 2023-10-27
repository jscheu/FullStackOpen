import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { setNotification } from '../reducers/notificationReducer';
import { setUsers } from '../reducers/usersReducer';

import usersService from '../services/users';

import UsersList from '../components/UsersList';
import UserDetail from '../components/UserDetail';

const UsersView = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersService.getAll();
        dispatch(setUsers(users));
      } catch (e) {
        const type = 'warning';
        const message = `error fetching blogs: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Routes>
        <Route path='/' element={<UsersList users={users} />} />
        <Route path='/:id' element={<UserDetail />} />
      </Routes>
    </div>
  );
};

export default UsersView;
