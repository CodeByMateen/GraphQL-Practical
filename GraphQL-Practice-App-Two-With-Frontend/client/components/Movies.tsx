'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MOVIES } from '../graphql/queries';
import { CREATE_MOVIE, UPDATE_MOVIE, DELETE_MOVIE } from '../graphql/mutations';
import { useState, useMemo, useRef, useEffect } from 'react';

export function Movies() {
  const { loading, error, data, refetch } = useQuery(GET_MOVIES);
  const [createMovie] = useMutation(CREATE_MOVIE, { onCompleted: () => refetch() });
  const [updateMovie] = useMutation(UPDATE_MOVIE, { onCompleted: () => refetch() });
  const [deleteMovie] = useMutation(DELETE_MOVIE, { onCompleted: () => refetch() });

  const [formData, setFormData] = useState({
    title: '',
    year: '',
    genre: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter movies based on search term
  const filteredMovies = useMemo(() => {
    const movies = (data as any)?.movies;
    if (!movies) return [];
    if (!searchTerm.trim()) return movies;
    
    const term = searchTerm.toLowerCase();
    return movies.filter((movie: any) => 
      movie.title.toLowerCase().includes(term) || 
      movie.genre.toLowerCase().includes(term) ||
      movie.year.toString().includes(term)
    );
  }, [data, searchTerm]);

  // Suggestions for autocomplete (max 5)
  const suggestions = useMemo(() => {
    const movies = (data as any)?.movies;
    if (!movies || !searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return movies
      .filter((movie: any) => 
        movie.title.toLowerCase().includes(term) || 
        movie.genre.toLowerCase().includes(term) ||
        movie.year.toString().includes(term)
      )
      .slice(0, 5);
  }, [data, searchTerm]);

  // Display movies - filtered by search or selected movie
  const displayMovies = useMemo(() => {
    const movies = (data as any)?.movies;
    if (selectedMovieId) {
      const movie = movies?.find((m: any) => m.id === selectedMovieId);
      return movie ? [movie] : [];
    }
    return filteredMovies;
  }, [selectedMovieId, filteredMovies, data]);

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

  const handleSuggestionClick = (movie: any) => {
    setSearchTerm(movie.title);
    setSelectedMovieId(movie.id);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setSelectedMovieId(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedMovieId(null);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMovie({
          variables: {
            id: editingId,
            movie: {
              title: formData.title,
              year: formData.year ? parseInt(formData.year) : undefined,
              genre: formData.genre,
            },
          },
        });
        setEditingId(null);
      } else {
        await createMovie({
          variables: {
            movie: {
              title: formData.title,
              year: parseInt(formData.year),
              genre: formData.genre,
            },
          },
        });
      }
      setFormData({ title: '', year: '', genre: '' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (movie: any) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title,
      year: movie.year.toString(),
      genre: movie.genre,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  if (loading) return <p className="text-blue-600">Loading movies...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Movies</h2>

      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies by title, genre, or year..."
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
            {suggestions.map((movie: any) => (
              <div
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{movie.title}</div>
                <div className="text-sm text-gray-600">{movie.year} • {movie.genre}</div>
              </div>
            ))}
          </div>
        )}
        
        {showSuggestions && searchTerm && suggestions.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-gray-600">
            No movies found
          </div>
        )}
      </div>

      {selectedMovieId && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Showing selected movie</span>
          <button
            onClick={handleClearSearch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filter
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-gray-900"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Movie' : 'Create Movie'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', year: '', genre: '' });
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {displayMovies.length === 0 && searchTerm && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-gray-600">
            No movies found matching "{searchTerm}"
          </div>
        )}
        {displayMovies.map((movie: any, index: number) => (
          <div key={`movie-${movie.id}-${index}`} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{movie.title}</h3>
                <p className="text-sm text-gray-600">Year: {movie.year}</p>
                <p className="text-sm text-gray-600">Genre: {movie.genre}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(movie)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
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

