// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/', { username, password }, { withCredentials: true });
      if (response.status === 200) {
        setError('');
        navigate('/home');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url("https://source.unsplash.com/random")' }}>
      <form onSubmit={handleLogin} className="p-6 bg-white bg-opacity-75 rounded shadow-md w-96">
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full py-2 px-3 bg-gray-700 text-white"
          />
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
        <div className="flex justify-between">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
          <button type="button" onClick={handleRegisterRedirect} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
