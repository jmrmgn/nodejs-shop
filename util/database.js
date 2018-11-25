const mysql = require('mysql2');

// For continues connecting to the database, instead of 'connect'
const pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   database: 'node-complete',
   password: ''
});

// Use to create promises, alternative for callbacks
module.exports = pool.promise();