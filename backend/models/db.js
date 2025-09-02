// backend/models/db.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL pool
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432,
});

// Connect and test
pool.connect((err) => {
  if (err) {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  } else {
    console.log("PostgreSQL Connected...");
    runInitSQL(); // Run init.sql after connection
  }
});

// Function to run init.sql automatically
function runInitSQL() {
  const initPath = path.join(__dirname, '..', 'sql', 'init.sql');
  fs.readFile(initPath, 'utf8', async (err, sql) => {
    if (err) {
      console.error("Error reading init.sql:", err);
      return;
    }
    try {
      await pool.query(sql);
      console.log("Database tables ensured (init.sql executed).");
    } catch (err) {
      console.error("Error executing init.sql:", err);
    }
  });
}

module.exports = pool;
