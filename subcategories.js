document.addEventListener('DOMContentLoaded', function() {
    function loadProductsFromLocalStorage() {
        const productsJson = localStorage.getItem('products');
        return productsJson ? JSON.parse(productsJson) : [];
    }

    function displayProducts(products) {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = ''; // Очищення карточок

        if (products.length === 0) {
            productGrid.innerHTML = '<p>Немає товарів для відображення</p>';
            return;
        }

        products.forEach(product => {
            if (product.subcategory === 'Ноутбуки') {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                productCard.addEventListener('click', function() {
                    window.location.href = product.url; // Перехід на сторінку товару
                });

                productCard.innerHTML = `
                    <img src="${product.photo}" alt="${product.name}" class="product-card__image">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__price">${product.price} грн</p>
                    <button class="product-card__buy-btn" data-id="${product.id}">Купити</button>
                `;

                productGrid.appendChild(productCard);
            }
        });
    }

    function sortProducts(products, order) {
        return products.sort((a, b) => {
            return order === 'asc' ? a.price - b.price : b.price - a.price;
        });
    }

    function filterProducts() {
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const typeSelect = document.getElementById('type');
        const manufacturerSelect = document.getElementById('manufacturer');
        const priceRange = document.getElementById('price-range');

        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        const type = typeSelect.value;
        const manufacturer = manufacturerSelect.value;

        const products = loadProductsFromLocalStorage();

        const filteredProducts = products.filter(product => {
            const characteristics = product.characteristics || {};
            return (product.price >= minPrice && product.price <= maxPrice) &&
                   (type ? characteristics.type === type : true) &&
                   (manufacturer ? characteristics.manufacturer === manufacturer : true) &&
                   product.subcategory === 'Ноутбуки';
        });

        displayProducts(sortProducts(filteredProducts, document.getElementById('sort-price').value));
    }

    function init() {
        const sortSelect = document.getElementById('sort-price');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const priceRange = document.getElementById('price-range');
        const typeSelect = document.getElementById('type');
        const manufacturerSelect = document.getElementById('manufacturer');

        // Товари по замовчуванню
        filterProducts();

        sortSelect.addEventListener('change', filterProducts);
        minPriceInput.addEventListener('input', filterProducts);
        maxPriceInput.addEventListener('input', filterProducts);
        priceRange.addEventListener('input', () => {
            maxPriceInput.value = priceRange.value;
            filterProducts();
        });
        typeSelect.addEventListener('change', filterProducts);
        manufacturerSelect.addEventListener('change', filterProducts);
    }

    init();
});
