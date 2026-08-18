import { Provider } from 'react-redux';
import { store } from './store';
import UsersList from './components/UserList';
import TodoList from './components/TodoList';

function App() {
  return (
    <Provider store={store}>
      <h1> React components API Practice test</h1>
      <UsersList />
      <TodoList />
    </Provider>
    // test commit
  );
}

export default App;
