const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const cors = require("cors");
const blogRoutes = require('./routes/blog');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// PostgreSQL connection
const pool = new Pool({
  host: "localhost",
  user: "your_pg_user",
  password: "your_pg_password",
  database: "blogdb",
  port: 5432, // default PostgreSQL port
});

// Test connection
pool.connect((err) => {
  if (err) throw err;
  console.log("PostgreSQL Connected...");
});

// Signup API
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [username, email, hashed]);
    res.json({ message: "Signup successful!", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "User already exists or DB error" });
  }
});

// Login API
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    res.json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

// Contact API
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields are required." });

  try {
    const query = `INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [name, email, message]);
    res.json({ message: "Message sent successfully!", contact: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.use('/api/blog', blogRoutes);

// Run Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
