// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import MovieList from './MovieList';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMovies('star wars'); // Default search query
  }, []);

  const fetchMovies = async (query) => {
    try {
      const response = await axios.get(`http://localhost:4000/home?search=${query}`, { withCredentials: true });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchQuery);
  };

  const handleUserIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    
    axios.post("http://localhost:4000/logout");
    navigate('/');
  }

  const handleProfile = () => {
    navigate('/profile');
  }

 

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded py-2 px-3 bg-gray-700 text-white"
            placeholder="Search for movies..."
          />
          <button type="submit" className="p-2 bg-red-600 text-white rounded">
            <FaSearch />
          </button>
        </form>
        <div className="relative">
          <FaUserCircle className="text-3xl cursor-pointer" onClick={handleUserIconClick} />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black border rounded shadow-md">
              <button onClick={handleProfile} className="block w-full text-left px-4 py-2 bg-gray-200 hover:bg-black hover:text-white">Profile</button>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 bg-gray-200 hover:bg-black hover:text-white">Logout</button>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Movies</h1>
      <MovieList movies={movies} />
    </div>
  );
};

export default Home;
