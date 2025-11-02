'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USERS } from '../graphql/queries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from '../graphql/mutations';
import { useState, useMemo, useRef, useEffect } from 'react';

export function Users() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER, { onCompleted: () => refetch() });
  const [updateUser] = useMutation(UPDATE_USER, { onCompleted: () => refetch() });
  const [deleteUser] = useMutation(DELETE_USER, { onCompleted: () => refetch() });

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    age: '',
    password: '',
    gender: 'OTHER',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    const users = (data as any)?.users;
    if (!users) return [];
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter((user: any) => 
      user.name.toLowerCase().includes(term) || 
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // Suggestions for autocomplete (max 5)
  const suggestions = useMemo(() => {
    const users = (data as any)?.users;
    if (!users || !searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return users
      .filter((user: any) => 
        user.name.toLowerCase().includes(term) || 
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      )
      .slice(0, 5);
  }, [data, searchTerm]);

  // Display users - filtered by search or selected user
  const displayUsers = useMemo(() => {
    const users = (data as any)?.users;
    if (selectedUserId) {
      const user = users?.find((u: any) => u.id === selectedUserId);
      return user ? [user] : [];
    }
    return filteredUsers;
  }, [selectedUserId, filteredUsers, data]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (user: any) => {
    setSearchTerm(`${user.name} (@${user.username})`);
    setSelectedUserId(user.id);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setSelectedUserId(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedUserId(null);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser({
          variables: {
            id: editingId,
            user: {
              username: formData.username,
              name: formData.name,
              email: formData.email,
              age: formData.age ? parseInt(formData.age) : undefined,
              password: formData.password || undefined,
              gender: formData.gender,
            },
          },
        });
        setEditingId(null);
      } else {
        await createUser({
          variables: {
            user: {
              username: formData.username,
              name: formData.name,
              email: formData.email,
              age: formData.age ? parseInt(formData.age) : 0,
              password: formData.password,
              gender: formData.gender,
            },
          },
        });
      }
      setFormData({ username: '', name: '', email: '', age: '', password: '', gender: 'OTHER' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      age: user.age?.toString() || '',
      password: '',
      gender: user.gender || 'OTHER',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  if (loading) return <p className="text-blue-600">Loading users...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Users</h2>

      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
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
            {suggestions.map((user: any) => (
              <div
                key={user.id}
                onClick={() => handleSuggestionClick(user)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">@{user.username} • {user.email}</div>
              </div>
            ))}
          </div>
        )}
        
        {showSuggestions && searchTerm && suggestions.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-gray-600">
            No users found
          </div>
        )}
      </div>

      {selectedUserId && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Showing selected user</span>
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
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
          />
          <input
            type="password"
            placeholder={editingId ? 'Password (leave blank to keep)' : 'Password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required={!editingId}
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? 'Update User' : 'Create User'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ username: '', name: '', email: '', age: '', password: '', gender: 'OTHER' });
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {displayUsers.length === 0 && searchTerm && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-gray-600">
            No users found matching "{searchTerm}"
          </div>
        )}
        {displayUsers.map((user: any, index: number) => (
          <div key={`user-${user.id}-${index}`} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{user.name} (@{user.username})</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.age && <p className="text-sm text-gray-600">Age: {user.age}</p>}
                {user.gender && <p className="text-sm text-gray-600">Gender: {user.gender}</p>}
                {user.friends?.length > 0 && (
                  <p className="text-sm text-gray-600">Friends: {user.friends.map((f: any) => f.name).join(', ')}</p>
                )}
                {user.favoriteMovies?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Favorite Movies: {user.favoriteMovies.map((m: any) => m.title).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
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

