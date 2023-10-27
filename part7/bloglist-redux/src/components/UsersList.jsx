import { Link } from 'react-router-dom';

const UsersList = ({ users }) => {
  if (!users || users.length === 0)
    return (
      <div>
        <h2>Users</h2>
      </div>
    );

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
                <td key={`user${index}`}>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td key={`created${index}`}>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
