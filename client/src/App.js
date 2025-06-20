import React, { useState } from 'react';
import './App.css';
import { useTodos } from './TodoContext';

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [text, setText] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    if (!text.trim()) {
      setValidationError('Task cannot be empty');
      return;
    }
    await addTodo(text);
    setText('');
  };

  return (
    <div className="App">
      <h1>MERN To Do Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={e => { setText(e.target.value); setValidationError(null); }}
          placeholder="New task…"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>

      {loading && <div className="error">Loading...</div>}
      {validationError && <div className="error">{validationError}</div>}
      {error && <div className="error">{error}</div>}

      <ul>
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button onClick={() => deleteTodo(todo._id)} title="Delete">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
