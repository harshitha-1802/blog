// backend/models/userModel.js
const db = require("./db"); // PostgreSQL pool

// Create a new user
async function createUser(username, email, hashedPassword) {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const result = await db.query(query, [username, email, hashedPassword]);
  return result.rows[0].id; // Return the new user's ID
}

// Find a user by email
async function findUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0]; // Returns undefined if not found
}

module.exports = { createUser, findUserByEmail };
