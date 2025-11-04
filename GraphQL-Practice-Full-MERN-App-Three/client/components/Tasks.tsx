'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TASKS } from '../graphql/queries';
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from '../graphql/mutations';
import { GET_USERS } from '../graphql/queries';
import { useState, useMemo, useRef, useEffect } from 'react';

export function Tasks() {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const { data: usersData } = useQuery(GET_USERS);
  const [createTask] = useMutation(CREATE_TASK, { onCompleted: () => refetch() });
  const [updateTask] = useMutation(UPDATE_TASK, { onCompleted: () => refetch() });
  const [deleteTask] = useMutation(DELETE_TASK, { onCompleted: () => refetch() });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userId: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    const tasks = (data as any)?.tasks;
    if (!tasks) return [];
    if (!searchTerm.trim()) return tasks;
    
    const term = searchTerm.toLowerCase();
    return tasks.filter((task: any) => 
      task.title.toLowerCase().includes(term) || 
      task.description.toLowerCase().includes(term) ||
      task.user?.name.toLowerCase().includes(term) ||
      task.user?.username.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // Suggestions for autocomplete (max 5)
  const suggestions = useMemo(() => {
    const tasks = (data as any)?.tasks;
    if (!tasks || !searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return tasks
      .filter((task: any) => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term) ||
        task.user?.name.toLowerCase().includes(term) ||
        task.user?.username.toLowerCase().includes(term)
      )
      .slice(0, 5);
  }, [data, searchTerm]);

  // Display tasks - filtered by search or selected task
  const displayTasks = useMemo(() => {
    if (selectedTaskId) {
      const tasks = (data as any)?.tasks;
      return tasks ? tasks.filter((task: any) => task.id === selectedTaskId) : [];
    }
    return filteredTasks;
  }, [filteredTasks, selectedTaskId, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setSelectedTaskId(null);
  };

  const handleSuggestionClick = (task: any) => {
    setSelectedTaskId(task.id);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedTaskId(null);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTask({
          variables: {
            id: editingId,
            title: formData.title || undefined,
            description: formData.description || undefined,
          },
        });
        setEditingId(null);
      } else {
        await createTask({
          variables: {
            title: formData.title,
            description: formData.description,
            userId: formData.userId,
          },
        });
      }
      setFormData({ title: '', description: '', userId: '' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (task: any) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      userId: task.user?.id || '',
    });
  };

  const handleToggleComplete = async (task: any) => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          completed: !task.completed,
        },
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  if (loading) return <p className="text-blue-600">Loading tasks...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>

      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks by title, description, or user..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((task: any) => (
              <div
                key={task.id}
                onClick={() => handleSuggestionClick(task)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{task.title}</div>
                <div className="text-sm text-gray-600">
                  {task.completed ? '✓ Completed' : '○ Pending'} • {task.user?.name || 'No user'}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showSuggestions && searchTerm && suggestions.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-gray-600">
            No tasks found
          </div>
        )}
      </div>

      {selectedTaskId && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Showing selected task</span>
          <button
            onClick={handleClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filter
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={!editingId}
          />
          {!editingId && (
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select User</option>
              {(usersData as any)?.users?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name} (@{user.username})
                </option>
              ))}
            </select>
          )}
        </div>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required={!editingId}
          rows={3}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Task' : 'Create Task'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', description: '', userId: '' });
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {displayTasks.length === 0 && searchTerm && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-gray-600">
            No tasks found matching "{searchTerm}"
          </div>
        )}
        {displayTasks.map((task: any, index: number) => (
          <div key={`task-${task.id}-${index}`} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                {task.user && (
                  <p className="text-sm text-gray-500 mt-1">
                    Assigned to: {task.user.name} (@{task.user.username})
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`px-3 py-1 text-white text-sm rounded ${
                    task.completed 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {task.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
