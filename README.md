# Pizza Shop

Bienvenue dans **Pizza Shop**, une application web complète pour la gestion des commandes de pizzas. Construite avec Node.js, Express et MySQL, cette application permet aux utilisateurs d'ajouter des pizzas à leur panier, de personnaliser leurs choix et de finaliser leurs commandes de manière sécurisée.

## Table des Matières

- Fonctionnalités
- Technologies Utilisées
- Installation
  - Prérequis
  - Étapes d'Installation
- Configuration
- Jeux de Données
- Utilisation
- Contribuer
- Licence
- Contact

## Fonctionnalités

- **Gestion du Panier** : Ajouter, supprimer et visualiser les pizzas sélectionnées.
- **Personnalisation des Pizzas** : Choisir la taille et les garnitures de chaque pizza.
- **Finalisation des Commandes** : Passer des commandes avec gestion des transactions pour assurer l'intégrité des données.
- **Suivi des Commandes** : Visualiser l'historique des commandes passées.
- **Interface Intuitive** : Interface utilisateur réactive et conviviale.
- **Taux de Change** : Intégration des taux de change pour une conversion des prix en différentes devises.

## Technologies Utilisées

- **Backend** :
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [MySQL](https://www.mysql.com/)
- **Frontend** :
  - HTML, CSS, JavaScript
- **Autres** :
  - [Axios](https://axios-http.com/)
  - [Express-Session](https://www.npmjs.com/package/express-session)

## Installation

### Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (v14 ou supérieure)
- [npm](https://www.npmjs.com/) (v6 ou supérieure)
- [MySQL](https://www.mysql.com/) (v5.7 ou supérieure)

### Étapes d'Installation

1. **Cloner le Dépôt**

   ```bash
   git clone https://github.com/votre-utilisateur/pizza-shop.git
   cd pizza-shop
   ```

2. **Installer les Dépendances**

   ```bash
   npm install
   ```

3. **Configurer la Base de Données**

   - **Démarrer MySQL** et créer une base de données nommée `pizza_shop`.

     ```sql
     CREATE DATABASE pizza_shop;
     ```

   - **Sélectionner la Base de Données**

     ```sql
     USE pizza_shop;
     ```

   - **Créer les Tables Nécessaires**

     ```sql
     -- Table pour les commandes
     CREATE TABLE IF NOT EXISTS commandes (
         id INT AUTO_INCREMENT PRIMARY KEY,
         total_price DECIMAL(10, 2) NOT NULL,
         order_date DATETIME NOT NULL
         -- Ajoutez d'autres colonnes si nécessaire, par exemple, user_id pour associer la commande à un utilisateur
     );

     -- Table pour les items de commande
     CREATE TABLE IF NOT EXISTS commande_items (
         id INT AUTO_INCREMENT PRIMARY KEY,
         order_id INT NOT NULL,
         pizza_id VARCHAR(10) NOT NULL,
         name VARCHAR(100) NOT NULL,
         size VARCHAR(20) NOT NULL,
         toppings JSON,
         price DECIMAL(10, 2) NOT NULL,
         FOREIGN KEY (order_id) REFERENCES commandes(id) ON DELETE CASCADE
     );
     ```

4. **Configurer les Variables d'Environnement**

   - Créez un fichier `.env` à la racine du projet :

     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=clovis
     DB_NAME=pizza_shop
     PORT=3000
     ```

   - **Ajouter `.env` au `.gitignore`**

     Assurez-vous que votre fichier `.env` est inclus dans le fichier `.gitignore` pour éviter de compromettre vos informations sensibles.

     ```gitignore
     # .gitignore
     node_modules/
     .env
     ```

5. **Importer les Jeux de Données**

   Pour faciliter le démarrage, vous pouvez importer les jeux de données fournis dans la section Jeux de Données.

6. **Démarrer le Serveur**

   ```bash
   node app.js
   ```

   *Ou, si vous utilisez `nodemon` pour le rechargement automatique :*

   ```bash
   nodemon app.js
   ```

7. **Accéder à l'Application**

   Ouvrez votre navigateur et naviguez vers [http://localhost:3000](http://localhost:3000).

## Configuration

Le fichier de configuration principal se trouve dans 

db.js

. Assurez-vous que les informations de connexion à la base de données sont correctes.

```javascript
// models/db.js
const mysql = require('mysql');
require('dotenv').config(); // Charger les variables d'environnement

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'clovis',
    database: process.env.DB_NAME || 'pizza_shop'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        process.exit(1); // Arrêter le serveur si la connexion échoue
    }
    console.log('Connecté à la base de données');
});

module.exports = db;
```

## Jeux de Données

Pour tester l'application, vous pouvez utiliser les jeux de données suivants. Ils incluent des pizzas prédéfinies et des commandes d'exemple.

### 1. **Insertion des Pizzas Disponibles**

```sql
INSERT INTO commandes (total_price, order_date)
VALUES ('0.00', '2024-01-01 00:00:00');
```

### 2. **Insertion d'Articles de Commande**

```sql
INSERT INTO commande_items (order_id, pizza_id, name, size, toppings, price)
VALUES
(1, '1', 'Margherita', 'M', '["Tomate", "Mozzarella", "Basilic"]', '8.00'),
(1, '2', 'Pepperoni', 'L', '["Pepperoni", "Fromage"]', '9.50'),
(1, '3', 'Quatre Fromages', 'M', '["Mozzarella", "Cheddar", "Parmesan", "Gorgonzola"]', '10.00'),
(1, '4', 'Végétarienne', 'M', '["Olives", "Champignons", "Poivrons"]', '9.00'),
(1, '5', 'Hawaïenne', 'L', '["Jambon", "Ananas"]', '9.50'),
(1, '6', 'Reine', 'M', '["Jambon", "Champignons", "Mozzarella"]', '9.00'),
(1, '7', 'Diavola', 'L', '["Pepperoni", "Piments"]', '9.50');
```

### 3. **Commande Exemple**

```sql
-- Création d'une commande fictive
INSERT INTO commandes (total_price, order_date)
VALUES ('29.80', '2024-04-15 12:30:00');

-- Récupérer l'ID de la dernière commande
SET @order_id = LAST_INSERT_ID();

-- Insertion des articles de la commande
INSERT INTO commande_items (order_id, pizza_id, name, size, toppings, price)
VALUES
(@order_id, '1', 'Margherita', 'M', '["Tomate", "Mozzarella", "Basilic"]', '8.00'),
(@order_id, '2', 'Pepperoni', 'L', '["Pepperoni", "Fromage"]', '9.50'),
(@order_id, '3', 'Quatre Fromages', 'M', '["Mozzarella", "Cheddar", "Parmesan", "Gorgonzola"]', '10.00');
```

**Remarques :**

- **Types de Données** :
  - `total_price` doit être un `DECIMAL(10,2)`.
  - `order_date` doit être au format `DATETIME`.
  - `toppings` est stocké au format JSON. Assurez-vous que votre version de MySQL (5.7+) le supporte.

- **Clés Étrangères** :
  - `order_id` dans `commande_items` fait référence à `id` dans `commandes`. Assurez-vous que les contraintes de clé étrangère sont correctement définies.

- **Sécurité** :
  - En production, utilisez des données réelles et sécurisées. Ne stockez pas de mots de passe en clair. Utilisez des mécanismes de hachage appropriés.

## Utilisation

1. **Ajouter une Pizza au Panier**

   - Parcourez la liste des pizzas disponibles.
   - Sélectionnez la taille et les garnitures désirées.
   - Cliquez sur "Ajouter au Panier".

2. **Visualiser le Panier**

   - Accédez à la section "Panier" pour voir les pizzas ajoutées.
   - Vous pouvez modifier les quantités ou supprimer des articles.

3. **Finaliser la Commande**

   - Cliquez sur "Commander" pour finaliser votre achat.
   - Remplissez les informations de livraison si nécessaire.
   - Confirmez la commande.

4. **Vérification des Commandes**

   - Les commandes sont enregistrées dans la base de données `commandes` avec leurs détails dans `commande_items`.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le dépôt.
2. **Créer une branche** pour votre fonctionnalité ou correction de bug.

   ```bash
   git checkout -b fonctionnalité/nom-de-la-fonctionnalité
   ```

3. **Commiter** vos changements.

   ```bash
   git commit -m "Ajoute une fonctionnalité XYZ"
   ```

4. **Pusher** la branche.

   ```bash
   git push origin fonctionnalité/nom-de-la-fonctionnalité
   ```

5. **Ouvrir une Pull Request**.

Assurez-vous de suivre les bonnes pratiques de développement et d'écrire des tests pour vos modifications.

## Licence

Ce projet est sous licence MIT.

## Contact

Pour toute question ou suggestion, veuillez contacter :

- **Nom** : Votre Nom
- **Email** : votre.email@example.com
- **LinkedIn** : [Votre Profil LinkedIn](https://www.linkedin.com/in/votre-profil)

---

Merci d'utiliser **Pizza Shop** ! 🍕😊