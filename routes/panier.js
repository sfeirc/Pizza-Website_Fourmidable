// routes/panier.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models/db'); // Assurez-vous que le chemin est correct

// Liste complète des pizzas disponibles
const pizzas = [
    { id: '1', name: 'Margherita', base_price: 8.00 },
    { id: '2', name: 'Pepperoni', base_price: 9.50 },
    { id: '3', name: 'Quatre Fromages', base_price: 10.00 },
    { id: '4', name: 'Végétarienne', base_price: 9.00 },
    { id: '5', name: 'Hawaïenne', base_price: 9.50 },
    { id: '6', name: 'Reine', base_price: 9.00 },
    { id: '7', name: 'Diavola', base_price: 9.50 },
    // Ajoutez d'autres pizzas si nécessaire
];

// GET /panier - Afficher le panier
router.get('/', (req, res) => {
    const panier = req.session.panier || [];
    res.render('panier', { panier: panier });
});

// POST /panier/ajouter - Ajouter un article au panier
router.post('/ajouter', (req, res) => {
    const { pizzaId, size, toppings, price } = req.body;

    // Vérifier les paramètres nécessaires
    if (!pizzaId || !size || !price) {
        console.log('Paramètres manquants:', req.body);
        return res.status(400).json({ success: false, message: 'Paramètres manquants.' });
    }

    // Trouver la pizza par ID
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) {
        console.log('Pizza non trouvée:', pizzaId);
        return res.status(400).json({ success: false, message: 'Pizza non trouvée.' });
    }

    // Créer l'objet cartItem avec le nom de la pizza
    const cartItem = { 
        pizzaId, 
        name: pizza.name, 
        size, 
        toppings, 
        price 
    };

    // Initialiser le panier si nécessaire
    if (!req.session.panier) {
        req.session.panier = [];
    }

    // Ajouter l'article au panier
    req.session.panier.push(cartItem);

    console.log('Pizza ajoutée au panier:', cartItem);
    console.log('Panier actuel:', req.session.panier);

    res.json({ success: true, message: 'Pizza ajoutée au panier.' });
});

// POST /panier/remove-from-cart - Retirer un article du panier
router.post('/remove-from-cart', (req, res) => {
    const { index } = req.body;

    console.log('--- Requête POST /remove-from-cart ---');
    console.log('Index reçu:', index);

    if (!req.session.panier || typeof index !== 'number' || !req.session.panier[index]) {
        console.log('Produit non trouvé ou index invalide.');
        return res.status(400).json({ success: false, message: 'Produit non trouvé dans le panier.' });
    }

    const removedItem = req.session.panier.splice(index, 1);
    console.log('Produit retiré:', removedItem);
    console.log('Panier actuel:', req.session.panier);

    res.json({ success: true, message: 'Produit retiré du panier.' });
});

// GET /panier/taux-de-change - Récupérer les taux de change
router.get('/taux-de-change', async (req, res) => {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des taux de change:', error);
        res.status(500).send('Erreur lors de la récupération des taux de change');
    }
});

// POST /panier/commandes - Finaliser la commande avec transaction
router.post('/commandes', (req, res) => {
    const panier = req.session.panier;

    console.log('--- Requête POST /commandes ---');
    console.log('Panier reçu:', panier);

    if (!panier || panier.length === 0) {
        console.log('Panier vide.');
        return res.status(400).json({ success: false, message: 'Votre panier est vide.' });
    }

    const totalPrice = panier.reduce((total, item) => total + item.price, 0).toFixed(2);
    const orderDate = new Date();

    console.log('Total Price Calculé:', totalPrice);
    console.log('Order Date:', orderDate);

    // Commencer une transaction
    db.beginTransaction(err => {
        if (err) {
            console.error('Erreur lors du démarrage de la transaction :', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur.' });
        }

        console.log('Transaction démarrée.');

        // Insérer la commande
        const insertOrderQuery = 'INSERT INTO commandes (total_price, order_date) VALUES (?, ?)';
        db.query(insertOrderQuery, [totalPrice, orderDate], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de la commande :', err);
                return db.rollback(() => {
                    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de la commande.' });
                });
            }

            const orderId = results.insertId;
            console.log('Commande insérée avec l\'ID:', orderId);

            // Préparer les items de la commande
            const orderItems = panier.map(item => [
                orderId,
                item.pizzaId,
                item.name,
                item.size,
                item.toppings ? JSON.stringify(item.toppings) : JSON.stringify([]),
                item.price
            ]);

            console.log('Items de la commande préparés:', orderItems);

            const insertItemsQuery = 'INSERT INTO commande_items (order_id, pizza_id, name, size, toppings, price) VALUES ?';
            db.query(insertItemsQuery, [orderItems], (err2) => {
                if (err2) {
                    console.error('Erreur lors de l\'insertion des items de la commande :', err2);
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement des items de la commande.' });
                    });
                }

                console.log('Items de la commande insérés.');

                // Commit la transaction
                db.commit(err3 => {
                    if (err3) {
                        console.error('Erreur lors du commit de la transaction :', err3);
                        return db.rollback(() => {
                            res.status(500).json({ success: false, message: 'Erreur du serveur.' });
                        });
                    }

                    console.log('Transaction commitée avec succès.');

                    // Vider le panier
                    req.session.panier = [];

                    res.json({ success: true, message: 'Commande passée avec succès.' });
                });
            });
        });
    });
});

module.exports = router;