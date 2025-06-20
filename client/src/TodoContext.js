import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/todos');
      setTodos(res.data);
    } catch (err) {
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/todos', { text });
      setTodos(prev => [res.data, ...prev]);
    } catch (err) {
      setError('Failed to add task.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todo) => {
    setError(null);
    try {
      const res = await axios.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed
      });
      setTodos(prev => prev.map(t => t._id === todo._id ? res.data : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const deleteTodo = async (id) => {
    setError(null);
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodoContext.Provider value={{ todos, loading, error, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
