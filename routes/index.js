// routes/index.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
    // Récupérer les pizzas vedettes
    const sql = 'SELECT * FROM pizzas WHERE featured = 1';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { pizzas: results });
    });
});

module.exports = router;