document.addEventListener('DOMContentLoaded', function () {
   // Функція для збереження користувачів у LocalStorage
function saveUsersToLocalStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

//Отримуємо користувачів із LocalStorage або створюємо масив із тестовими користувачами 
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: '1',
        phone: '1234567890',
        firstName: 'Іван',
        lastName: 'Іванов',
        email: 'ivan@example.com',
        password: 'password123'
    },
    {
        id: '2',
        phone: '0987654321',
        firstName: 'Петр',
        lastName: 'Петров',
        email: 'petr@example.com',
        password: 'mypassword'
    }
];

// Зберігаємо користувачів у LocalStorage, якщо їх там ще немає
if (!localStorage.getItem('users')) {
    saveUsersToLocalStorage(users);
}

    // Модальне вікно
    const accountButton = document.getElementById('account-button');
    const modal = document.getElementById('account-modal');
    const closeButton = document.getElementById('close-button');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    if (accountButton) {
        accountButton.addEventListener('click', () => {
            modal.style.display = 'block';
            const hash = window.location.hash;
            if (hash) {
                const targetTab = document.querySelector(hash);
                if (targetTab) {
                    switchTab(hash);
                }
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    tabLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            switchTab(targetId);
            window.location.hash = targetId;
        });
    });

    function switchTab(targetId) {
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        document.querySelector(targetId).classList.add('active');
        document.querySelector(`a[href="${targetId}"]`).classList.add('active');
    }
    
    // Генерація випадкового пароля
    function generatePassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    //Обробка форми реєстрації 
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const phone = document.getElementById('register-phone').value;
        const firstName = document.getElementById('register-first-name').value;
        const lastName = document.getElementById('register-last-name').value;
        const email = document.getElementById('register-email').value;

        const userId = Date.now().toString(); //  timestamp  ID
        const password = generatePassword(8);

        const user = {
            id: userId,
            phone,
            firstName,
            lastName,
            email,
            password
        };

        // Додаємо нового користувача до масиву
        users.push(user);

        // Зберігаємо масив користувачів у LocalStorage
        saveUsersToLocalStorage(users);
  

        
        //Надсилання email з підтвердженням 
        emailjs.init('Jj1FaNS_twJ-saLCb'); // Иніціализація EmailJS с вашим user ID
        emailjs.send('service_0u7u6tl', 'template_dn7w8lj', {
            user_name: `${firstName} ${lastName}`,
            user_email: email,
            user_password: password
            
        })
        
        .then((response) => {
            alert('Реєстрація пройшла успішно. Перевірте свою електронну пошту');
        }, (error) => {
            alert('Помилка при надсиланні email: ' + error.text);
        });

        modal.style.display = 'none';
    });
    
    // Функція збереження поточного користувача в LocalStorage
    function setCurrentUser(userId) {
        localStorage.setItem('currentUserID', userId);
    }
// Обробка форми входу
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.phone === phone && user.password === password);

    if (user) {
        setCurrentUser(user.id); // Збереження поточного користувача перед переходом
        alert('Ви успішно увійшли до системи!');
        window.location.href = './user-account.html'; // Перенаправлення на сторінку особистого кабінету
    } else {
        alert('Неправильний номер телефону або пароль');
    }
})
// Кнопка "Каталог"
document.getElementById('catalog-btn').addEventListener('click', function(event) {
    var menu = document.querySelector('.catalog-menu');
    var isMenuVisible = menu.style.display === 'block';
    var allMenus = document.querySelectorAll('.catalog-menu');
    
    //Приховати всі меню 
    allMenus.forEach(function(menu) {
        menu.style.display = 'none';
    });

    // Toggle меню
    menu.style.display = isMenuVisible ? 'none' : 'block';
    
    // Запобігання негайному закриванню меню подією клацання
    event.stopPropagation();
});

// Приховати меню під час натискання ззовні
document.addEventListener('click', function(event) {
    var menu = document.querySelector('.catalog-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    }
});
//карусель
const prevButton = document.querySelector('.carousel__control--prev');
  const nextButton = document.querySelector('.carousel__control--next');
  const wrapper = document.querySelector('.carousel__wrapper');
  const items = document.querySelectorAll('.carousel__item');
  let currentIndex = 0;

  function updateCarousel() {
    const offset = -currentIndex * 100;
    wrapper.style.transform = `translateX(${offset}%)`;
  }

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  // автоматична прокрутка
 /* setInterval(() => {
    nextButton.click();
  }, 5000); // 5000 мс = 5 секунд*/
});

// Корзина
document.getElementById('cart-icon').addEventListener('click', showCart);
document.getElementById('close-cart').addEventListener('click', hideCart);
// Функція для відображення корзини
function showCart() {
    document.getElementById('cart-container').classList.remove('cart-hidden');
    document.getElementById('cart-container').classList.add('cart-visible');
    displayCart(); 
    
}

// Функція для прикриття корзини
function hideCart() {
    document.getElementById('cart-container').classList.remove('cart-visible');
    document.getElementById('cart-container').classList.add('cart-hidden');
}

// Функція для відображення вмісту корзини
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsContainer = document.getElementById('cart-items');
    let cartTotalContainer = document.getElementById('cart-total');
    let cartEmptyMessage = document.getElementById('cart-empty-message');
    
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartTotalContainer.innerHTML = '';
        document.getElementById('checkout-button').style.display = 'none';
    } else {
        cartEmptyMessage.style.display = 'none';
        document.getElementById('checkout-button').style.display = 'block';

        cart.forEach((item, index) => {
            let { photo, name, quantity, price } = item;
            let subtotal = quantity * price;
            totalAmount += subtotal;

            let productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `
                <img src="${photo}" alt="${name}" style="width: 50px; height: auto;">
                <div class="cart-item-details">
                    <p>Название: ${name}</p>
                    <p>Количество: 
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        ${quantity}
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </p>
                    <p>Цена: ${price} грн</p>
                    <p>Сумма: ${subtotal} грн</p>
                    <button class="remove-btn" onclick="removeItem(${index})">Видалити</button>
                </div>
            `;
            cartItemsContainer.appendChild(productElement);
        });

        cartTotalContainer.innerHTML = `Разом: ${totalAmount} грн`;
    }
}

// Функція для оновлення кількості товару
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1; // мінімальна кількість
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // онвити корзину
}

// Функція для видалення товару з корзини
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // видаляє один елемент
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // оновити корзину
}
// Функція для переходу на сторінку оформлення замовлення
document.getElementById('checkout-button').addEventListener('click', function() {
    window.location.href = './checkout.html';
});

// Додавання обробників подій
document.getElementById('cart-icon').addEventListener('click', showCart);
document.getElementById('close-cart').addEventListener('click', hideCart);

// Показуємо вміст кошика під час завантаження сторінки
displayCart();

// Об'єкт підкатегорій
const subcategories = {
    "WashingMachines": "Пральні машини",
    "Refrigerators": "Холодильники",
    "Televisions": "Телевізори",
    "smartphones": "Смартфони",
    "Phones": "Телефони",
    "Headphones": "Навушники",
    "Tablets": "Планшети",
    "Monitors": "Монітори",
    "Laptops": "Ноутбуки",
    
};

// Функція для завантаження даних із файлу JSON та збереження їх у LocalStorage
function loadProductsFromFile() {
    // Створюємо запит на сервер для завантаження JSON файлу
    fetch('./productsWithUrls.json') 
        .then(response => response.json())
        .then(products => {
            // Оновлення підкатегорії для кожного товару
            products = products.map(product => ({
                ...product,
                subcategory: subcategories[product.subcategory] || 'Невідомо'
            }));
            // Перетворюємо дані на JSON-рядок і зберігаємо в LocalStorage
            localStorage.setItem('products', JSON.stringify(products));
            console.log('Товари успішно завантажені з файлу та збережені в LocalStorage');
        })
        .catch(error => console.error('Помилка завантаження файлу:', error));
}

//Функція для завантаження даних із LocalStorage 
function loadProductsFromLocalStorage() {
    const productsJson = localStorage.getItem('products');
    return productsJson ? JSON.parse(productsJson) : [];
}

//Функція для додавання нових товарів та оновлення LocalStorage 
function addProductsToLocalStorage(newProducts) {
    let products = loadProductsFromLocalStorage();
    //Додаємо нові товари до масиву 
    products = products.concat(newProducts);

    // Перетворюємо оновлений масив товарів на JSON-рядок
    const productsJson = JSON.stringify(products);

    //Зберігаємо JSON-рядок у LocalStorage 
    localStorage.setItem('products', productsJson);

    console.log('Товари успішно збережені в LocalStorage');
}

// Приклад 
document.addEventListener('DOMContentLoaded', loadProductsFromFile);

//  URL з LocalStorage 
function showProductLinks() {
    const productList = document.getElementById('product-list');
    const products = loadProductsFromLocalStorage();
    products.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = product.url;
        productLink.textContent = product.name;
        /*productList.appendChild(productLink);*/
    });
}

// Виклик функції для відображення посилань
document.addEventListener('DOMContentLoaded', showProductLinks);

//Пошук
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
const searchResults = document.getElementById('search-results');

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    
    console.log('Поиск по запросу:', query);
});


function getProductsFromLocalStorage() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}
function searchProducts(query) {
    const products = getProductsFromLocalStorage();
    return products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );
}
function displaySearchResults(query) {
    const results = searchProducts(query);
    const resultsContainer = document.getElementById('search-results');
    
    if (resultsContainer) {
        resultsContainer.innerHTML = results.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <a href="${product.url}">${product.name}</a>
                    <div class="price">${product.price} грн</div>
                </div>
                <img src="${product.photo}" alt="${product.name}" />
            </div>
        `).join('');
        resultsContainer.style.display = results.length ? 'block' : 'none';
    } else {
        console.error('Element with id "search-results" не знайдено.');
    }
    
}

document.getElementById('search-input').addEventListener('input', (event) => {
    displaySearchResults(event.target.value);
});
 //Очищення результатів під час кліку за межами області 
 document.addEventListener('click', (event) => {
    if (searchResults && searchInput && searchButton) {
        const isClickInside = searchResults.contains(event.target) || 
                              searchInput.contains(event.target) || 
                              searchButton.contains(event.target);
        if (!isClickInside) {
            searchResults.innerHTML = ''; 
            searchResults.style.display = 'none'; //Приховати результати пошуку 
        }
    } else {
        console.error('elements not found.');
    }
});
// Секція популярних товарів
function getProductsFromLocalStorage() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}
// Фунція отримання випадкових (раномеих) товарів
function getRandomProducts(products, count = 12) {
    // Перемішуємо масив товарів
    const shuffled = products.sort(() => 0.5 - Math.random());
    // Повертаємо перші `count` елементів
    return shuffled.slice(0, count);
}
function displayPopularProducts() {
    const products = getProductsFromLocalStorage();
    const randomProducts = getRandomProducts(products, 12); // Отримуємо 12 випадкових товарів

    const container = document.querySelector('.popular-products__grid');
    container.innerHTML = ''; // 

    randomProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'popular-products__card';

        productCard.innerHTML = `
            <img src="${product.photo}" alt="${product.name}" class="popular-products__card-image">
            <div class="popular-products__card-name">${product.name}</div>
            <div class="popular-products__card-price">${product.price} грн</div>
            <a href="${product.url}" class="popular-products__card-btn">Детальніше</a>
        `;

        container.appendChild(productCard);
    });
}

// Виклик функції для відображення популярних товарів
displayPopularProducts();
