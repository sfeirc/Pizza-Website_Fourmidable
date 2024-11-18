// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Middleware d'authentification simple
router.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth === 'clovis') {
        next();
    } else {
        res.status(401).send('Accès refusé');
    }
});

router.get('/', (req, res) => {
    res.render('admin');
});

module.exports = router;