const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'BadBunnySQL2022!',
  database: 'organization'
});

module.exports = db;