document.addEventListener('DOMContentLoaded', function () {
    
    // Отримуємо всі елементи вкладок та вмісту
    const tabMenuItems = document.querySelectorAll('.tabs__menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    // Функція для перемикання вкладок
    function switchTab(event) {
        const tabId = event.target.getAttribute('data-tab');

        // Видаляємо активний клас у всіх вкладок
        tabMenuItems.forEach(item => item.classList.remove('active'));

        // Додаємо активний клас до поточної вкладки
        event.target.classList.add('active');

        // Приховуємо весь вміст вкладок
        tabContents.forEach(content => content.classList.remove('active'));

        // Показуємо вміст вибраної вкладки
        document.getElementById(tabId).classList.add('active');
    }

    //Додаємо обробник кліків на всі елементи вкладок 
    tabMenuItems.forEach(item => {
        item.addEventListener('click', switchTab);
    });

    // Об'єднання вмісту вкладок в основну
    const mainTabContent = document.getElementById('tab-1');
    const tab2Content = document.getElementById('tab-2');
    const tab3Content = document.getElementById('tab-3');
    const tab4Content = document.getElementById('tab-4');
    const tab5Content = document.getElementById('tab-5');
    const tab6Content = document.getElementById('tab-6');

    if (mainTabContent) {
        if (tab2Content) mainTabContent.innerHTML += tab2Content.innerHTML;
        if (tab3Content) mainTabContent.innerHTML += tab3Content.innerHTML;
        if (tab4Content) mainTabContent.innerHTML += tab4Content.innerHTML;
        if (tab5Content) mainTabContent.innerHTML += tab5Content.innerHTML;
        if (tab6Content) mainTabContent.innerHTML += tab6Content.innerHTML;
    } else {
        console.error('Основная вкладка не найдена');
    }

    // Оголошуємо змінну для зберігання підкатегорій
    let subcategories = [];

    // Завантажуємо дані з subcategories.json
    fetch('subcategories.json')
        .then(response => response.json())
        .then(data => {
            subcategories = data;
            console.log('Загруженные подкатегории:', subcategories);

            // Отримуємо дані товару з LocalStorage чи іншого джерела
            const productsArray = JSON.parse(localStorage.getItem('products')) || [];
            const productData = productsArray.find(p => p.name === 'Product Name'); // Замініти на логіку отримання конкретного товару

            if (productData) {
                displayCharacteristics(subcategories, productData.characteristics || {});
            } else {
                console.error('Товар не найден');
            }
        })
        .catch(error => console.error('Ошибка загрузки:', error));

    // Функція для відображення характеристик таблиці
    function displayCharacteristics(subcategories, productData) {
        const tabContent = document.getElementById('tab-2'); // Контейнер для вкладки "Характеристики"
        if (!tabContent) return;

        const table = document.createElement('table');
        table.classList.add('characteristics-table'); // Додаємо клас для стилізації таблиці

        // Створюємо рядки таблиці
        subcategories.forEach(subcategory => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = subcategory.name; // Назва характеристики
            row.appendChild(nameCell);

            const valueCell = document.createElement('td');
            valueCell.textContent = productData[subcategory.id] || 'N/A'; // Значение характеристики або 'N/A'

            table.appendChild(row);
        });

        tabContent.appendChild(table);
    }
});
