// routes/menu.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM pizzas';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('menu', { pizzas: results });
    });
});

module.exports = router;