// public/js/pizza.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customization-form');
    const priceSpan = document.getElementById('price');
    const basePrice = parseFloat(priceSpan.textContent.replace(',', '.'));
    const sizeSelect = document.getElementById('size');
    const toppingsCheckboxes = document.querySelectorAll('input[name="toppings"]');

    const toppingPrices = {
        "Olives": 0.5,
        "Fromage supplémentaire": 1.0,
        "Pepperoni": 1.5,
        "Champignons": 0.7,
        "Poivrons": 0.6,
        "Ananas": 0.8,
        "Jambon": 1.2
        // Ajoutez les autres suppléments avec leurs prix
    };

    form.addEventListener('change', updatePrice);
    form.addEventListener('submit', addToCart);

    function updatePrice() {
        let totalPrice = basePrice;

        // Ajuster le prix selon la taille
        const size = sizeSelect.value;
        const sizeMultiplier = size === 'small' ? 1 : size === 'medium' ? 1.2 : 1.5;
        totalPrice *= sizeMultiplier;

        // Ajouter le prix des suppléments sélectionnés
        toppingsCheckboxes.forEach(topping => {
            if (topping.checked && toppingPrices[topping.value]) {
                totalPrice += toppingPrices[topping.value];
            }
        });

        priceSpan.textContent = totalPrice.toFixed(2).replace('.', ',') + '€';
    }

    function addToCart(event) {
        event.preventDefault();
        const size = sizeSelect.value;
        const toppings = Array.from(toppingsCheckboxes)
            .filter(topping => topping.checked)
            .map(topping => topping.value);
        const pizzaId = document.getElementById('pizza-id').value;
        const price = parseFloat(priceSpan.textContent.replace(',', '.'));

        fetch('/panier/ajouter', { // Utilisez /panier/ajouter pour correspondre aux routes
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pizzaId, size, toppings, price })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Pizza ajoutée au panier !');
                // Optionnel : Mettre à jour dynamiquement le nombre d'éléments dans le panier
            } else {
                alert('Erreur lors de l\'ajout au panier : ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
            alert('Erreur lors de l\'ajout au panier.');
        });
    }
});