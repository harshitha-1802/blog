const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const blogRoutes = require('./routes/blog');

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your MySQL username
  password: "Harshitha@18", // your MySQL password
  database: "blogdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Signup API
app.post("/api/auth/signup", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Error hashing password" }); // changed
    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hash],
      (err, result) => {
        if (err) return res.status(500).json({ error: "User already exists or DB error" }); // changed
        res.json({ message: "Signup successful!" });
      }
    );
  });
});

// Login API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" }); // changed
    if (results.length === 0) return res.status(400).json({ error: "User not found" }); // changed

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Error checking password" }); // added
      if (!isMatch) return res.status(400).json({ error: "Invalid password" }); // changed
      res.json({ message: "Login successful!", user: results[0] });
    });
  });
});

app.use('/api/blog', blogRoutes);

// Run Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
// Contact API
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(query, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Message sent successfully!" });
  });
});
