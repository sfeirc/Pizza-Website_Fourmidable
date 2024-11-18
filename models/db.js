// models/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'clovis',
    database: 'pizza_shop'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données');
});

module.exports = db;