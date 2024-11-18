// routes/contact.js
const express = require('express');
const router = express.Router();

// GET /contact
router.get('/', (req, res) => {
    res.render('contact');
});

// POST /contact (Optional: Handle form submissions)
router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    // Handle form data (e.g., save to database, send email)
    // For demonstration, we'll just log the data and redirect
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    res.redirect('/contact?success=true');
});

module.exports = router;