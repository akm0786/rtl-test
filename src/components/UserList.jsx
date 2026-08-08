import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../features/users/usersSlice';

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  // Different states handle karo
  if (status === 'pending') {
    return (
      <div className="loading">
        <h2>Loading users...</h2>
        <div className="spinner">🔄</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="error">
        <h2>Error loading users</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchUsers())}>Retry</button>
      </div>
    );
  }

  // Check karo ki users array mein data hai ya nahi
  if (users.length === 0 && status === 'succeeded') {
    return <div>No users found</div>;
  }

  return (
    <div className="users-container">
      <h2>Random Users ({users.length})</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.login?.uuid || user.email} className="user-card">
            <img 
              src={user.picture?.medium} 
              alt={`${user.name?.first} ${user.name?.last}`}
            />
            <h3>{user.name?.title} {user.name?.first} {user.name?.last}</h3>
            <p>📧 {user.email}</p>
            <p>📱 {user.phone}</p>
            <p>📍 {user.location?.city}, {user.location?.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;