// backend/models/db.js
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Harshitha@18",
  database: "blogdb"
});
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});
module.exports = db;
