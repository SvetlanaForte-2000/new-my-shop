// localStorage
function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function addProducts(products) {
    const existingProducts = getProducts();
    const updatedProducts = existingProducts.concat(products);
    saveProducts(updatedProducts);
}

// Завантаження даних з JSON-файла
async function loadProductsFromJSON() {
    try {
        const response = await fetch('newproduct.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        addProducts(products);
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

// Завантаження товарів из JSON при завнтаженні сторінки
document.addEventListener('DOMContentLoaded', loadProductsFromJSON);


