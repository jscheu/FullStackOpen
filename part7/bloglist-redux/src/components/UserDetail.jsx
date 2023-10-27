import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div>
        <h2>user not found</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>{user.name}</h2>
      {user.blogs.length > 0 ? (
        <div>
          <h3>added blogs</h3>
          <ul>
            {user.blogs.map((blog, index) => (
              <li key={index}>{blog.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>no blogs added yet</p>
      )}
    </div>
  );
};

export default UserDetail;
