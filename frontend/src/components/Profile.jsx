// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import the left arrow icon

const Profile = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const userResponse = await axios.get('http://localhost:4000/profile', { withCredentials: true });
        setUser(userResponse.data);

        // Fetch favorite movie details
        if (userResponse.data.favorites.length > 0) {
          const moviePromises = userResponse.data.favorites.map(id =>
            axios.get(`http://www.omdbapi.com/?i=${id}&apikey=4edafad0`) // Replace with your API endpoint
          );
          const moviesResponse = await Promise.all(moviePromises);
          setMovies(moviesResponse.map(res => res.data));
        }
      } catch (error) {
        console.error('Error fetching profile or movies:', error);
        navigate('/'); // Redirect to home if there's an error
      }
    };

    fetchProfile();
  }, [navigate]);

  const removeFromFavorites = async (movieID) => {
    try {
      await axios.post('http://localhost:4000/remove-favourite', { movieID }, { withCredentials: true });
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.imdbID !== movieID));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen relative">
      {/* Left arrow button */}
      <button
        onClick={() => navigate('/home')}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
      >
        <FaArrowLeft />
      </button>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <h2 className="text-2xl font-bold mt-4">Favorites</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="border p-4 rounded shadow-md bg-gray-800 text-white">
              <img src={movie.Poster} alt={movie.Title} className="w-full h-48 object-cover mb-4 rounded" />
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{movie.Title}</h2>
                  <p>{movie.Year}</p>
                </div>
                <button
                  onClick={() => removeFromFavorites(movie.imdbID)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No favorite movies</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
