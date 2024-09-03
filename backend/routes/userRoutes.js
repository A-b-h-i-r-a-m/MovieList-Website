const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Successful Registration' });
  } catch (error) {
    console.error('Error while registering:', error);
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Error while registering' });
    }
  }
});

// Login
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    req.session.user = { _id: user._id }; // Initialize and assign session
    res.status(200).json({ message: 'Login Successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});


// Home
router.get('/home', authMiddleware, async (req, res) => {
  try {
    const query = req.query.search || 'star wars'; // Default to 'star wars' if no query is provided
    const api = `http://www.omdbapi.com/?s=${query}&apikey=4edafad0`;
    const response = await axios.get(api);
    const movies = response.data.Search;
    res.status(200).json(movies);
  } catch (error) {
    console.log('Error fetching movies', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

//Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
      const userId = req.session.user._id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const result = { username: user.username, favorites: user.favourites };
      res.status(200).json(result);
  } catch (error) {
      console.error('Error while fetching profile', error);
      res.status(500).json({ message: 'Error finding profile' });
  }
});

//Add Favourite
router.post('/add-favourite', async (req, res) => {
  try {
    const userId = req.session.user._id; // Ensure user is authenticated
    const { movieID } = req.body;

    // Find user and add movie to favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is already in favorites
    if (!user.favourites.includes(movieID)) {
      user.favourites.push(movieID);
      await user.save();
      res.status(200).json({ message: 'Movie added to favorites' });
    } else {
      res.status(400).json({ message: 'Movie is already in favorites' });
    }
  } catch (error) {
    console.error('Error adding movie to favorites:', error);
    res.status(500).json({ message: 'Error adding movie to favorites' });
  }
});

//Remove favourite
router.post('/remove-favourite', async (req, res) => {
  try {
    const userId = req.session.user._id; // Ensure user is authenticated
    const { movieID } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favourites = user.favourites.filter(id => id !== movieID);
    await user.save();
    res.status(200).json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error('Error removing movie from favorites:', error);
    res.status(500).json({ message: 'Error removing movie from favorites' });
  }
});



//Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});


module.exports = router;
