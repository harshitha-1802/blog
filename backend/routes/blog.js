// backend/routes/blog.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all blogs
router.get('/', (req, res) => {
  db.query('SELECT * FROM blogs ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Get a single blog by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!results.length) return res.status(404).json({ error: 'Blog not found' });
    res.json(results[0]);
  });
});

// Create a new blog
router.post('/', (req, res) => {
  const { title, category, content, tags } = req.body;
  const sql = 'INSERT INTO blogs (title, category, content, tags, date) VALUES (?, ?, ?, ?, NOW())';
  db.query(sql, [title, category, content, Array.isArray(tags) ? tags.join(',') : tags], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Blog created', id: result.insertId });
  });
});

// Delete a blog
router.delete('/:id', (req, res) => {
  console.log('Attempting to delete blog with id:', req.params.id);
  db.query('DELETE FROM blogs WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Delete error:', err); // Log the actual error
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Blog deleted' });
  });
});

module.exports = router;
