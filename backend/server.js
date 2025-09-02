require('dotenv').config();
const express = require("express");
const path = require('path');
const bcrypt = require("bcrypt");
const cors = require("cors");
const blogRoutes = require('./routes/blog');
const db = require('./models/db');

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend static files
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// Root serves the frontend index
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// DB pool is created in models/db.js

// Signup API
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hash]
    );
    return res.json({ message: "Signup successful!", userId: result.rows[0].id });
  } catch (err) {
    return res.status(500).json({ error: "User already exists or DB error" });
  }
});

// Login API
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!result.rows || result.rows.length === 0) return res.status(400).json({ error: "User not found" });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });
    return res.json({ message: "Login successful!", user });
  } catch (err) {
    return res.status(500).json({ error: "DB error" });
  }
});

app.use('/api/blog', blogRoutes);

// Run Server
const PORT = process.env.PORT || 5000;

// Health endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    const tableNames = result.rows.map(t => t.table_name);
    return res.json({
      ok: true,
      db: 'connected',
      tables: tableNames
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'DB not reachable' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// Contact API
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)";
  db.query(query, [name, email, message])
    .then(() => res.json({ message: "Message sent successfully!" }))
    .catch(() => res.status(500).json({ error: "Database error" }));
});
