// backend/models/userModel.js
const db = require("./db");

async function createUser(username, email, hashedPassword) {
  const [result] = await db.execute(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

module.exports = { createUser, findUserByEmail };
