const mysql = require("mysql");
require("dotenv").config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // if its null
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

conn.connect((error) => {
  if (error) {
    console.log("Database connection fail");
    return;
  }
  console.log("Database connection established");
});

module.exports = conn;
