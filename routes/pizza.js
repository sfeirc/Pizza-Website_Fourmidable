// routes/pizza.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/:id', (req, res) => {
    const pizzaId = req.params.id;
    const sql = 'SELECT * FROM pizzas WHERE id = ?';
    db.query(sql, [pizzaId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('pizza', { pizza: results[0] });
        } else {
            res.status(404).send('Pizza non trouvée');
        }
    });
});

module.exports = router;