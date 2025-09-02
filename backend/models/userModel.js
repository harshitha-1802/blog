// backend/models/userModel.js
const db = require("./db");

async function createUser(username, email, hashedPassword) {
  const result = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
    [username, email, hashedPassword]
  );
  return result.rows[0].id;
}

async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

module.exports = { createUser, findUserByEmail };
