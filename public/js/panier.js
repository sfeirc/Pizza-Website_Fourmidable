// public/js/panier.js

document.getElementById('currency').addEventListener('change', updateCurrency);

async function updateCurrency() {
    const currency = document.getElementById('currency').value;
    try {
        const response = await fetch('/panier/taux-de-change', {
            method: 'GET',
            credentials: 'same-origin' // Assurez-vous que les cookies sont envoyés
        });
        const data = await response.json();
        const rate = data.rates[currency];
        updatePrices(rate, currency);
    } catch (error) {
        console.error('Erreur lors de la récupération des taux de change', error);
    }
}

function updatePrices(rate, currency) {
    const priceElements = document.querySelectorAll('.item-price');
    priceElements.forEach(el => {
        const basePrice = parseFloat(el.dataset.basePrice);
        el.textContent = (basePrice * rate).toFixed(2) + ' ' + currency;
    });
    // Mettre à jour le total
    const totalElement = document.getElementById('total-price');
    const baseTotal = parseFloat(totalElement.dataset.baseTotal);
    totalElement.textContent = (baseTotal * rate).toFixed(2) + ' ' + currency;
}

document.getElementById('order-button').addEventListener('click', () => {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-icon"></div>
        <p>Préparation de vos pizzas...</p>
    `;
    document.body.appendChild(loader);
    setTimeout(() => {
        loader.querySelector('p').textContent = 'Vos pizzas sont prêtes !';
        setTimeout(() => {
            loader.remove();
            // Réinitialiser le panier ou rediriger
        }, 2000); // 2 secondes pour l'exemple
    }, 5000); // 5 secondes pour l'exemple

    // Envoyer une requête pour enregistrer la commande
    fetch('/panier/commandes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // Assurez-vous que les cookies sont envoyés
        body: JSON.stringify({}) // Envoyer un corps JSON vide
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
            // Rediriger vers une page de confirmation ou réactualiser la page
            window.location.href = '/'; // Remplacez par la route de confirmation si disponible
        } else {
            alert(result.message || 'Une erreur est survenue.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la commande.');
    });
});

// Gestion des boutons de suppression
document.addEventListener('DOMContentLoaded', () => {
    const removeButtons = document.querySelectorAll('.remove-button');

    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const index = parseInt(button.getAttribute('data-index'), 10);
            if (isNaN(index)) {
                console.error('Index invalide pour la suppression.');
                return;
            }

            // Envoyer une requête POST pour retirer l'article
            fetch('/panier/remove-from-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin', // Assurez-vous que les cookies sont envoyés
                body: JSON.stringify({ index })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    // Rafraîchir la page pour mettre à jour le panier
                    window.location.reload();
                } else {
                    alert(data.message || 'Une erreur est survenue.');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la suppression.');
            });
        });
    });
});