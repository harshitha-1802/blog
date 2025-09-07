// backend/models/userModel.js
require("dotenv").config(); // load env variables
const db = require("./db"); // PostgreSQL pool

// Use table name from .env or fallback to "users"
const USER_TABLE = process.env.DB_USER_TABLE || "users";

// Create a new user
async function createUser(username, email, hashedPassword) {
  const query = `
    INSERT INTO ${USER_TABLE} (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const result = await db.query(query, [username, email, hashedPassword]);
  return result.rows[0].id; // Return the new user's ID
}

// Find a user by email
async function findUserByEmail(email) {
  const query = `SELECT * FROM ${USER_TABLE} WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0] || null; // Explicitly return null if not found
}

module.exports = { createUser, findUserByEmail };
