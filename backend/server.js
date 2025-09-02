require('dotenv').config(); // Load environment variables
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const cors = require("cors");
const blogRoutes = require('./routes/blog');

const app = express();
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// PostgreSQL connection using environment variables
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432,
});

// Test connection
pool.connect((err) => {
  if (err) {
    console.error("PostgreSQL connection error:", err);
    process.exit(1); // Stop server if DB fails
  } else {
    console.log("PostgreSQL Connected...");
  }
});

// ======================
// Signup API
// ======================
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`;
    const result = await pool.query(query, [username, email, hashed]);
    res.status(201).json({ message: "Signup successful!", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User already exists or DB error" });
  }
});

// ======================
// Login API
// ======================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Exclude password from response
    delete user.password;
    res.json({ message: "Login successful!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ======================
// Contact API
// ======================
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const query = `INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email`;
    const result = await pool.query(query, [name, email, message]);
    res.status(201).json({ message: "Message sent successfully!", contact: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Blog routes
app.use('/api/blog', blogRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
