const express = require('express');

const router = express.Router();

router.get('/facebook/callback', (req, res) => {
  res.json({ message: 'success' });
});

module.exports = router;