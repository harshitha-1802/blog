require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection pool
const db = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432,
});

// Test DB connection
db.connect()
  .then(() => console.log('PostgreSQL Connected...'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Auto-run init.sql to create tables if they don't exist
const initSqlPath = path.join(__dirname, 'init.sql');
const initSql = fs.readFileSync(initSqlPath, 'utf8');

db.query(initSql)
  .then(() => console.log('Tables created or verified'))
  .catch((err) => console.error('Error initializing tables:', err));

// Make db accessible in routes
app.locals.db = db;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);

// Contact API
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const query = "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)";
    await db.query(query, [name, email, message]);
    res.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// SPA fallback for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server on Vercel port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Optional, useful for testing
