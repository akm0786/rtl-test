import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTodos,
  addTodo,
  toggleTodoStatus,
  deleteTodo,
} from '../features/todos/todosSlice';

const TodoList = () => {
  const dispatch = useDispatch();
  const { items: todos, status, error } = useSelector((state) => state.todos);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addTodo({ title, isComplete: false }));
    setTitle('');
  };

  if (status === 'loading') return <div>Loading todos...</div>;
  if (status === 'failed')
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchTodos())}>Retry</button>
      </div>
    );

  return (
    <div className="todo-container">
      <h1>Todo List</h1>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 && <p>No todos yet</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.isComplete ? 'completed' : ''}>
            <span
              style={{
                textDecoration: todo.isComplete ? 'line-through' : 'none',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => dispatch(toggleTodoStatus(todo._id))}>
              {todo.isComplete ? 'Undo' : 'Done'}
            </button>
            <button onClick={() => dispatch(deleteTodo(todo._id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;