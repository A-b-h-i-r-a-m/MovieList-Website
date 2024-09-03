// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/register', { username, password });
      if (response.status === 201) {
        alert('Account created successfully');
        setError('');
        navigate('/');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url("https://source.unsplash.com/random")' }}>
      <form onSubmit={handleRegister} className="p-6 bg-white bg-opacity-75 rounded shadow-md w-96">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full py-2 px-3 bg-gray-700 text-white"
          />
          {error === 'Username already exists' && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full py-2 px-3 bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full py-2 px-3 bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
