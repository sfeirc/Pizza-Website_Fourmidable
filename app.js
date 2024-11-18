// app.js
const express = require('express');
const path = require('path');
const session = require('express-session'); // Middleware de gestion des sessions
const app = express();

// Importer les routes
const indexRouter = require('./routes/index');
const menuRouter = require('./routes/menu');
const panierRouter = require('./routes/panier'); // Route du panier
const pizzaRouter = require('./routes/pizza');
const contactRouter = require('./routes/contact');

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware global
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration des sessions
app.use(session({
    secret: 'votre-cle-secrete', // Remplacez par une clé secrète forte en production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettez à true si vous utilisez HTTPS
}));

// Utiliser les routes
app.use('/', indexRouter);
app.use('/menu', menuRouter);
app.use('/panier', panierRouter); // Utilisation de la route du panier
app.use('/pizza', pizzaRouter);
app.use('/contact', contactRouter);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});