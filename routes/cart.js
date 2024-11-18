// routes/cart.js

const express = require('express');
const router = express.Router();

// POST /cart/add-to-cart
router.post('/add-to-cart', (req, res) => {
    const { pizzaId, size, toppings, price } = req.body;

    if (!pizzaId || !size || !price) {
        console.log('Paramètres manquants:', req.body);
        return res.status(400).json({ success: false, message: 'Paramètres manquants.' });
    }

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItem = { pizzaId, size, toppings, price };
    req.session.cart.push(cartItem);

    console.log('Pizza ajoutée au panier:', cartItem);
    console.log('Cart actuel:', req.session.cart);

    res.json({ success: true });
});

// POST /cart/remove-from-cart
router.post('/remove-from-cart', (req, res) => {
    const { index } = req.body;

    if (!req.session.cart || !req.session.cart[index]) {
        return res.status(400).json({ success: false, message: 'Produit non trouvé dans le panier.' });
    }

    const removedItem = req.session.cart.splice(index, 1);
    console.log('Produit retiré:', removedItem);
    console.log('Cart actuel:', req.session.cart);

    res.redirect('/cart');
});

// GET /cart
router.get('/', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

module.exports = router;