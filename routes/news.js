const express = require('express');
const passport = require('passport');

const router = express.Router();

const NewsItem = require('../models/News');

// Get all news
router.get('/', async (req, res) => {
  const items = await NewsItem.find();
  res.json(items);
});

// Get news by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const item = await NewsItem.findById(id);
  if (!item) {
    res.status(400).json({ message: `Item with id: ${id} not found` });
  }
  res.json(item);
});

// Create news
router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ message: 'Body property "content" should not be empty' });
  }
  const newNews = new NewsItem({
    content
  });

  const newsItem = await newNews.save();
  res.json(newsItem);
});

// Update news by id
// Protected via local authentication
router.put('/:id', passport.authenticate('local'), async (req, res) => {
  const { content } = req.body;
  if (!req.params.id || !req.body || !content) {
    res.status(400).json({ message: 'Incorrect request parameters or request body' });
  }
  const newNewsItem = {
    content
  };
  const updated = await NewsItem.findOneAndUpdate({_id: req.params.id}, newNewsItem);
  res.json(updated);
});

// Delete news
// Protected via local authentication
router.delete('/:id', passport.authenticate('local'), async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Request query parameter id is required' });
  }
  const item = await NewsItem.findById(req.params.id);
  if (!item) {
    res.status(400).send({ message: `News item with id ${req.params.id} not found` });
  }
  const removedItem = await item.remove();
  res.json(removedItem);
});

module.exports = router;
