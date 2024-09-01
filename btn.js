document.addEventListener('DOMContentLoaded', function() {
    // Завантаження товарів з LocalStorage
    function loadProductsFromLocalStorage() {
        const productsJson = localStorage.getItem('products');
        if (productsJson) {
            try {
                return JSON.parse(productsJson);
            } catch (e) {
                console.error('Ошибка парсинга JSON:', e);
                return [];
            }
        }
        return [];
    }

    // Додавання товара в корзину
    function addToCart(productId) {
        const products = loadProductsFromLocalStorage();
        console.log('Загруженные товары:', products);
        console.log('Ищем товар с ID:', productId); 

        const product = products.find(p => p.id === productId);
        console.log('Найденный товар:', product); 

        if (product) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity = (cartItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Товар додано в корзину');
        } else {
            console.error('Товар не знайдено');
        }
    }

    // Обробник кліків на кнопку "Купити"
    const buyButtons = document.querySelectorAll('.product-card__buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const productId = button.getAttribute('data-id');
            console.log('Кнопка нажата для товара с ID:', productId);
            addToCart(productId);
        });
    });
});
