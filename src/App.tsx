import { useState, useEffect } from 'react';
import { apiClient, type Todo } from './lib/api/client';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Make sure the backend is running!');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      setError(null);
      const newTodo = await apiClient.createTodo(newTodoText);
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      setError(null);
      const updated = await apiClient.toggleTodo(id, !completed);
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error toggling todo:', err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      await apiClient.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Todo App Example
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Frontend (React) ↔ Backend (Cloudflare Worker) ↔ Database (D1)
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newTodoText.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Todo
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading todos...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No todos yet. Add one above!</p>
              <p className="text-sm mt-2">
                Make sure to run <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">wrangler dev</code> for the backend
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How This Works
          </h2>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>1. Frontend (this React app) makes API calls using <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">src/lib/api/client.ts</code></li>
            <li>2. API calls go to the backend at <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://localhost:8787/api/todos</code></li>
            <li>3. Backend (Cloudflare Worker) handles requests in <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">worker/index.ts</code></li>
            <li>4. Data is stored in D1 database using Drizzle ORM</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Run <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">npm run dev</code> and <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">wrangler dev</code> to start both servers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;