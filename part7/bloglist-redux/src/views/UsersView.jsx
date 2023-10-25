import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { setUsers } from '../reducers/usersReducer';

import usersService from '../services/users';

const UsersView = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  console.log(users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersService.getAll();
        dispatch(setUsers(users));
      } catch (e) {
        const type = 'error';
        const message = `error fetching blogs: ${e.message}`;
        dispatch(setNotification({ type, message }));
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th key='topLeft'></th>
            <th key='createdHeader'>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={index}>
                <td key={`user${index}`}>{user.name}</td>
                <td key={`created${index}`}>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersView;
