const fs = require('fs');
const path = require('path');

// Завантаження даних товарів із JSON файлу
const dataFilePath = path.join(__dirname, './newproduct.json');
const productsData = require(dataFilePath); // Завантажуємо дані з файлу

// Перетворення даних на масив з додаванням підкатегорій
const products = Object.keys(productsData).flatMap(category => 
    productsData[category].map(product => ({
        ...product,
        subcategory: category // Додаємо підкатегорію до кожного товару
    }))
);

//Шлях до папки, де зберігатимуться сторінки
const saveDirectory = path.join(__dirname, 'product'); // Папка 'product' для всіх файлів HTML

// Переконайтеся, що директорія існує, або створіть її
if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory, { recursive: true });
}

//Функція для створення безпечного імені файлу
const sanitizeFileName = (name) => {
    return name
        .replace(/[\s\W_]+/g, '-') // Замінюємо пробіли та спеціальні символи на дефіси
        .replace(/^-+|-+$/g, '')   // Видаляємо початкові та кінцеві дефіси
        .toLowerCase();            // Наводимо до нижнього регістру
};
const characteristicTranslations = {
        "type": "Вид",
        "manufacturer": "Виробник",
        "numberOfSIMs": "Кількість SIM-карт",
        "SIMCardFormat": "Формат SIM-карти",
        "builtInMemory": "Вбудована пам'ять",
        "purpose": "Призначення",
        "displayDiagonal": "Дисплей (діагональ)",
        "displayMatrixType": "Дисплей (тип матриці)",
        "processor": "Процесор",
        "processorCores": "Процесор (кількість ядер)",
        "numberOfCameras": "Кількість камер в основному блоці",
        "batteryType": "Акумулятор (тип)",
        "batteryCapacity": "Ємність акумулятора, мАг",
        "chargingTechnology": "Технології заряджання",
        "warranty": "Гарантія, міс.",
        "countryOfManufacture": "Країна-виробник",
        "physical_characteristics": "Фізичні характеристики",
        "protectionClass": "Клас захисту",
        "designFeatures": "Особливості конструкції",
        "mainColor": "Колір (основний)",
        "productWidth": "Загальна ширина виробу (W), мм",
        "productHeight": "Загальна висота виробу (H), мм",
        "thickness": "Товщина, мм",
        "weight": "Вага, грам",

        "phone_type": "Тип",
        "numberOfSIMs": "Кількість SIM-карт",
        "simMode": "Режим роботи SIM-карт",
        
        "communicationStandard": "Cтандарт зв'язку",
        "caseType": "Тип корпусу",
        "targetAudience": "Для кого",
        "display": "Дисплей",
        "display_diagonal": "Дисплей (діагональ)",
        "camera": "Камера",
        "wireless_interfaces": "Бездротові інтерфейси",
        "connection_interface": "Інтерфейс підключення",
        "powerSupply": "Живлення",
        "batteryType": "Акумулятор (тип)",
        "batteryCapacity": "Ємність акумулятора, мАг",
        "physical_characteristics": "Фізичні характеристики",
        "caseMaterial": "Матеріал корпусу",
        "shockproof": "Протиударний",
        "color": "Колір",
        "headphoneType": "Тип навушників",
        "connectionType": "Тип підключення",
       
        "display_matrix_type": "Дисплей (тип матриці)",
        "display_max_resolution": "Дисплей (макс.роздільна здатність)",
        "display_touchscreen": "Дисплей (сенсорний екран)",
        "display_screen_coating": "Дисплей (покриття екрану)",
        "display_refresh_rate": "Дисплей (частота оновлення)",
        "display_response_time": "Дисплей (час відгуку), мс",
        "display_brightness": "Дисплей (яскравість), кд/м²",
        "ramType": "Оперативна пам'ять (тип)",
        "storage": "Оперативна пам'ять (об'єм)",
        "ramSlots": "Оперативна пам'ять (к-ть слотів)",
        "processorManufacturer": "Процесор (виробник)",
        "processorGeneration": "Процесор (ядро/покоління)",
        "processorModel": "Процесор (модель)",
        "processorTurboClockSpeed": "Процесор (тактова частота - turbo), ГГц",
        "processorCoresThreads": "Процесор (к-сть ядер/потоків)",
        "integratedGraphics": "Відеокарта (інтегрована)",
        "dedicatedGraphics": "Відеокарта (дискретна)",
        "graphicsMemory": "Відеокарта (об'єм пам'яті)",
        "graphicsMemoryType": "Відеокарта (тип пам'яті)",
        "vrSupport": "Підтримка VR",
        "builtInStorage": "Вбудований накопичувач",
        "memoryCardSlot": "Слот для карт пам'яті",
        "preinstalledOs": "Передвстановлена ОС",
        "wifi": "Бездротові інтерфейси (Wi-Fi)",
        "bluetoothNfc": "Бездротові інтерфейси (Bluetooth/NFC)",
        "batteryCapacity": "Акумулятор (ємність), Втг",
        "batteryType": "Акумулятор (тип)",
        "batteryCharging": "Зарядка",
        "keyboardBacklight": "Підсвітка клавіатури",
        "weight": "Вага ноутбука (без ЗП), кг",
        "product_dimensions": "Габарити (ШхГхВ), мм",
        "portType": "Типи портів",
        "audioOutput": "Аудіовихід",
        "audioInput": "Аудіовхід",
        "webcam": "Вебкамера",
        "microphone": "Мікрофон",   
        "totalCapacity": "Загальний об'єм, л",
        "refrigeratorCapacity": "Об'єм холодильного відділення, л",
        "freezerCapacity": "Об'єм морозильного відділення, л",
        "coolingType": "No Frost",
        "height": "Висота",
        "energyClass": "Клас енергоспоживання",
        "defrostType": "Тип розморожування",
        "numberOfDoors": "Кількість дверей",
        "numberOfCompartments": "Кількість відділень",
        "depth": "Глибина, см",   
        "screenSize": "Розмір екрана",  
        "resolution": "Дозвіл",  
        "refreshRate": "Частота оновлення", 
         "responseTime": "Час відповіді", 
          "spinSpeed": "Швидкість",  
    
};
// Шаблон HTML сторінки товару
const template = (product) => `
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name}</title>
    <link rel="stylesheet" href="./css/css/styles.css">
    <link rel="stylesheet" href="./css/css/product-card.css">
</head>
<body>
   <header class="header">
        <div class="header-top">
            <div class="container">
                <nav class="header-top-nav">
                    <ul>
                        <li><a href="#about">Про нас</a></li>
                        <li><a href="#delivery">Доставка та оплата</a></li>
                        <li><a href="./catalog.html">Каталог</a></li>
                        <li><a href="#sale">Акції</a></li>
                    </ul>
                    <div class="header-top-right">
                        <a href="tel:+380123456789" class="phone">+380 123 456 789</a>
                        <button id="account-button" class="btn-primary">Особистий кабінет</button>
                    </div>
                </nav>
            </div>
        </div>
        <div class="header-bottom-wrapper">
            <div class="container">
                <!-- Другий рядок хедера -->
                <div class="header-bottom">
                 
                        <div class="header-bottom-content">
                            <a href="./index.html" class="logo">
                                <img src="./images/free-icon-circle-button-458511 (1).png" alt="Логотип" />
                            </a>
                            <nav class="header-bottom-nav">
                                <ul>
                                    <li><!-- Кнопка каталога -->
                                        <div class="catalog">
                                            <button id="catalog-btn">Каталог</button>
                                            <div class="catalog-menu">
                                                <div class="category">
                                                    <span>Смартфони та гаджети</span>
                                                    <div class="subcategory">
                                                        <a href="./smartphones.html">Смартфони</a>
                                                        <a href="./phones.html">Телефони</a>
                                                        <a href="./headphones.html">Навушники</a>
                                                    </div>
                                                </div>
                                                <div class="category">
                                                    <span>Ноутбуки та компьютери</span>
                                                    <div class="subcategory">
                                                        <a href="./laptops.html">Ноутбуки</a>
                                                        <a href="./monitors.html">Монітори</a>
                                                        <a href="./tablets.html">Планшети</a>
                                                    </div>
                                                </div>
                                                <div class="category">
                                                    <span>Побутова техніка</span>
                                                    <div class="subcategory">
                                                        <a href="./refrigerators.html">Холодильники</a>
                                                        <a href="./tv.html">Телевізори</a>
                                                        <a href="./washing-machines.html">Пральні машини</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <!-- Пошук -->
                                        <div class="search-container">
                                            <input type="text" class="search-input" id="search-input" placeholder="Пошук по товарам..." />
                                            <button class="search-button">Пошук</button>
                                            <div id="search-results" class="search-results">
                                                <!-- Результати-->
                                            </div>
                                        </div>
                                    </li>
                                    <li> <!-- Корзина -->
                                        <button id="cart-icon" aria-label="Корзина">
                                            <img src="./images/basket.png" alt="Корзина" />
                                        </button>
                                    
                                        <!-- Контейнер корзини -->
                                        <div id="cart-container" class="cart-hidden">
                                            <button id="close-cart">Закрити корзину</button>
                                            <div id="cart-items"></div>
                                            <div id="cart-summary">
                                                <p id="cart-empty-message">Ваш кошик порожній</p>
                                                <p id="cart-total"></p>
                                                <button id="checkout-button">Оформити замовлення</button>
                                            </div>
                                            
                                        </div>
                                     </li>
                                </ul>
                            </nav>
                        </div>
                    
                </div>
            </div>
        </div>
    </header>
    <div class="product-card">
        <!-- Вкладки зверху -->
        <ul class="tabs__menu">
            <li class="tabs__menu-item active" data-tab="tab-1">Усе про товар</li>
            <li class="tabs__menu-item" data-tab="tab-2">Характеристики</li>
            <li class="tabs__menu-item" data-tab="tab-3">Відгуки</li>
            <li class="tabs__menu-item" data-tab="tab-4">Питання </li>
            <li class="tabs__menu-item" data-tab="tab-5">Відео</li>
            <li class="tabs__menu-item" data-tab="tab-6">Купують разом</li>
        </ul>
   
        <!-- Основна ынформація: зображення та інфо-->
        <div class="product-card__main">
            <div class="product-card__image">
                  <img src="${product.photo}" alt="Product Image">
            </div>
            <div class="product-card__info">
                <h2 class="product-card__title">${product.name}</h2>
                <p class="product-card__price">${product.price}</p>
                <p class="product-card__description">${product.description}</p>
                <div class="product-card__actions">
                    <button class="product-card__buy-btn" data-id="${product.id}">Купити</button>
                    <button class="product-card__wishlist-button">Бажання</button>
                </div>
            </div>
        </div>
   
        <!-- Вкладки знизу-->
        <div class="tabs__content">
            <div id="tab-1" class="tab-content active">
                <p> "Усе про товар".</p>
               
            </div>
            <div id="tab-2" class="tab-content">
                <p>Характеристики:</p>
                <div id="subcategory-container">
                    <table id="characteristics-table">
                        <thead>
                            <tr>
                                <th>Назва харектиристики</th>
                                <th>Значення харектиристики</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${Object.entries(product.characteristics).map(([key, value]) => `
                            <tr>
                                <td>${characteristicTranslations[key] || key}</td>
                                <td>${value}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="tab-3" class="tab-content">
                <p>Вкладка"Відгуки".</p>
            </div>
            <div id="tab-4" class="tab-content">
                <p>Вкладка"Питання".</p>
            </div>
            <div id="tab-5" class="tab-content">
                <p>Вкладка "Відео".</p>
            </div>
            <div id="tab-6" class="tab-content">
                <p>"Купують разом".</p>
            </div>
        </div>
    </div>
     <!-- Модальне вікно для 'Особистий кабінет' -->
     <div id="account-modal" class="modal">
        <div class="modal-content">
            <span class="close-button" id="close-button">&times;</span>
            <div class="modal-tabs">
                <a href="#login" class="tab-link active">Увійти</a>
                <a href="#register" class="tab-link">Зареєструватися</a>
            </div>
            <div id="login" class="tab-content active">
                <h2>Увійти в особистий кабінет</h2>
                <form class="form-modal" id="login-form">
                    <label for="login-phone">Номер телефону</label>
                    <input type="tel" id="login-phone" name="phone" required>
                    
                    <label for="login-password">Пароль</label>
                    <input type="password" id="login-password" name="password" required>
                    
                    <button type="submit" class="btn-primary">Далі</button>
                </form>
            </div>
            <div id="register" class="tab-content">
                <h2>Реєстрація</h2>
                <form class="form-modal" id="register-form">
                    <label for="register-phone">Номер телефону</label>
                    <input type="tel" id="register-phone" name="phone" required>
                    
                    <label for="register-first-name">Ім'я</label>
                    <input type="text" id="register-first-name" name="first-name" required>
                    
                    <label for="register-last-name">Прізвище</label>
                    <input type="text" id="register-last-name" name="last-name" required>
                    
                    <label for="register-email">Електронна адреса</label>
                    <input type="email" id="register-email" name="email" required>
                    
                    <button type="submit" class="btn-primary">Далі</button>
                </form>
            </div>
        </div>
    </div>
    <footer></footer>
     <script src="https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuid.min.js"></script>
    <script type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
    </script>
    <script src="./product-card.js"></script>
    <script src="./script.js"></script>
    <script src="./btn.js"></script>
</body>
</html>
`;
products.forEach((product) => {
    const productFileName = `${sanitizeFileName(product.name)}.html`;
    const productFilePath = path.join(saveDirectory, productFileName);

    // Запис HTML у файл
    fs.writeFileSync(productFilePath, template(product), 'utf8');
    console.log(`Сторінка для ${product.name} створена по шляшу ${productFilePath}`);

// Додавання URL до об'єкту продукту
    
    product.url = `/product/${sanitizeFileName(product.name)}.html`;
});

console.log('Генерацію сторінок завершено');


//Збереження даних із URL у файл для подальшого використання 
const productsWithUrlsFilePath = path.join(__dirname, 'productsWithUrls.json');
fs.writeFileSync(productsWithUrlsFilePath, JSON.stringify(products, null, 2), 'utf8');

console.log('Дані товарів з URL збережені у файлі productsWithUrls.json');
// Збереження даних з URL у LocalStorage
const productsWithUrls = JSON.stringify(products);
fs.writeFileSync(path.join(__dirname, 'productsWithUrls.json'), productsWithUrls, 'utf8');

console.log('Дані товарів з URL збережені у файлі productsWithUrls.json');
