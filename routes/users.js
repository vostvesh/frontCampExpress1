const express = require('express');

const router = express.Router();

const User = require('../models/User');

// Register new user
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'User already exists' });

  const newUser = new User({
    username,
    email,
    password
  });

  const savedUser = await newUser.save();
  res.json(savedUser);
});

module.exports = router;
