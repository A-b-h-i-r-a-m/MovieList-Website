// src/components/MovieList.js
import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';

const MovieList = ({ movies }) => {
  const addToFavourites = async (movie) => {
    try {
      await axios.post('http://localhost:4000/add-favourite', { movieID: movie.imdbID }, { withCredentials: true });
      alert('Movie added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
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
              <FaPlusCircle
                className="text-2xl cursor-pointer hover:text-red-500"
                onClick={() => addToFavourites(movie)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No movies available</p>
      )}
    </div>
  );
};

export default MovieList;
