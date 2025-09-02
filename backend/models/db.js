// backend/models/db.js
require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  user: process.env.PGUSER || process.env.DB_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.PGDATABASE || process.env.DB_NAME || 'blogdb',
  port: Number(process.env.PGPORT || 5432),
  max: 10,
  idleTimeoutMillis: 30000
});

module.exports = db;
