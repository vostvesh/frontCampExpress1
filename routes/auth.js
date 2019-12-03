const express = require('express');
const passport = require('passport');

const router = express.Router();

// Login
// Protected via facebook authentication. Works only from browser
router.get('/login', passport.authenticate('facebook'), (req, res) => {
  res.json({ message: 'login success!!!' });
});

router.get('/facebook/callback', (req, res) => {
  res.json({ message: 'success' });
});

module.exports = router;
