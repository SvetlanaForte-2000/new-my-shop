document.addEventListener("DOMContentLoaded", () => {
    loadUserInfo();
    loadOrders();

    document.querySelectorAll('.order').forEach(orderElement => {
        orderElement.addEventListener('click', event => {
            const orderId = event.currentTarget.dataset.orderId;
            showOrderDetails(orderId);
        });
    });

    setupEventListeners();
});

function loadUserInfo() {
    const currentUserID = localStorage.getItem('currentUserID');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (currentUserID && users.length) {
        const currentUser = users.find(user => user.id === currentUserID);

        if (currentUser) {
            document.querySelector("#user-name").textContent = currentUser.firstName;
            document.querySelector("#user-email").textContent = currentUser.email;
            document.querySelector("#user-phone").textContent = currentUser.phone;
        } else {
            console.log('Пользователь не найден');
        }
    }
}
function loadOrders() {
    const currentUserID = localStorage.getItem('currentUserID');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersSection = document.querySelector("#orders");
    ordersSection.innerHTML = ''; //Очищення перед додаванням нових замовлень 

    //Перевіряємо поточного користувача  по currentUserID
    const currentUser = users.find(user => user.id === currentUserID);

    if (!currentUser) {
        console.error('Текущий пользователь не найден.');
        return;
    }

    // Фільтрування замовлень за номером телефону поточного користувача
    const userOrders = orders.filter(order => order.userInfo.phone === currentUser.phone);

    userOrders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");
        orderDiv.dataset.orderId = order.id;
        orderDiv.innerHTML = `
            <h3 class="order__title" onclick="toggleOrderDetails(${order.id})">Замовлення #${order.id}</h3>
            <p class="order__date">Дата: ${order.statusHistory[0].date}</p>
            <p class="order__status">Статус: ${order.status}</p>
            <div class="order__details" style="display:none;"></div>
        `;
        ordersSection.appendChild(orderDiv);
    });
}


function toggleOrderDetails(orderId) {
    const orderElement = document.querySelector(`.order[data-order-id='${orderId}'] .order__details`);
    
    if (orderElement) {
        orderElement.style.display = orderElement.style.display === "none" || orderElement.style.display === "" ? "block" : "none";
    } else {
        console.error('Елемент з класом order__details не знайдено');
    }
}
function showOrderDetails(orderId) {
    const ordersData = localStorage.getItem('orders');
    const orders = JSON.parse(ordersData) || [];
    console.log('Завантажені замовлення:', orders);

    // Приведення orderId до числа
    const order = orders.find(o => o.id === Number(orderId));

    if (!order) {
        console.error('Замовлення не знайдено з ID:', orderId);
        return;
    }

    const orderElement = document.querySelector(`.order[data-order-id='${orderId}'] .order__details`);
    if (!orderElement) {
        console.error('Элемент с классом order__details не найден.');
        return;
    }

    orderElement.innerHTML = `
        <h4>Деталі замовлення</h4>
        <p>Статус: ${order.status}</p>
        <p>Сума замовлення: ${order.totalAmount}</p>
        ${order.items.map(item => `
            <p>Назва: ${item.name}</p>
            <p>Ціна: ${item.price} грн</p>
            <p>Кількість: ${item.quantity} шт</p>
        `).join('')}
        <h4>Інформація про замовника</h4>
        <p>Ім'я: ${order.userInfo.name}</p>
        <p>Номер телефону: ${order.userInfo.phone}</p>
        <p>Email: ${order.userInfo.email}</p>
        <p>Місто: ${order.userInfo.city || 'не вказано'}</p>
        <p>Спосіб доставки: ${order.deliveryMethod || 'не вказано'}</p>
        <h4>Статус замовлення</h4>
        ${order.statusHistory.map(status => `
            <p>${status.status} - ${status.date}</p>
        `).join('')}
    `;
}


/*
console.log('Завантажені замовлення:', orders); // Всі замовлення в консоль

console.log('Данні з localStorage:', localStorage.getItem('orders')); // Перевірка
*/



function showSection(sectionId) {
    document.querySelectorAll('.content__section').forEach(section => {
        section.classList.remove('content__section--active');
    });
    document.getElementById(sectionId).classList.add('content__section--active');
}

const currentUserID = localStorage.getItem('currentUserID');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (currentUserID && users.length) {
                const currentUser = users.find(user => user.id === currentUserID);

                if (currentUser) {
                    // Заповнення особистої інформації
                    document.querySelector("#user-name").textContent = currentUser.firstName;
                    document.querySelector("#user-email").textContent = currentUser.email;
                    document.querySelector("#user-phone").textContent = currentUser.phone;

                    document.querySelector("#edit-first-name").value = currentUser.firstName;
                    document.querySelector("#edit-last-name").value = currentUser.lastName;
                    document.querySelector("#edit-middle-name").value = currentUser.middleName || '';
                    document.querySelector("#edit-phone").value = currentUser.phone;
                    document.querySelector("#edit-email").value = currentUser.email;
                    document.querySelector("#edit-birthdate").value = currentUser.birthdate || '';
                } else {
                    console.log('Користувача не знайдено');
                }
            } else {
                console.log('Користувач не знайдений чи немає користувачів в localStorage');
            }

          /*  function setupEventListeners() {
                document.getElementById('edit-phone-btn').addEventListener('click', () => toggleEditField('phone'));
                document.getElementById('edit-email-btn').addEventListener('click', () => toggleEditField('email'));
                document.getElementById('edit-birthdate-btn').addEventListener('click', () => toggleEditField('birthdate'));
            
                document.getElementById('edit-addresses').addEventListener('click', editAddresses);
                document.getElementById('connect-google').addEventListener('click', connectGoogle);
                document.getElementById('edit-socials').addEventListener('click', editSocials);
                document.getElementById('update-subscriptions').addEventListener('click', updateSubscriptions);
            }
            
            function toggleEditField(field) {
                const input = document.getElementById(`edit-${field}`);
                const button = document.getElementById(`edit-${field}-btn`);
            
                if (input.readOnly) {
                    // Редагування
                    input.readOnly = false;
                    input.classList.add('editable'); // Додавання'editable'
                    input.focus();
                    button.textContent = 'Змінити'; // Змінюємо кнопку 'Зберегти'
                } else {
                    // Збереження змін
                    input.readOnly = true;
                    input.classList.remove('editable'); //Прибираємо'editable'
                    button.textContent = 'Зберегти'; // Змінюємо текст кнопки на 'Змінити'
            
                    // Збереження даних ( localStorage)
                    const currentUserID = localStorage.getItem('currentUserID');
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const currentUser = users.find(user => user.id === currentUserID);
            
                    if (currentUser) {
                        currentUser[field] = input.value;
                        localStorage.setItem('users', JSON.stringify(users));
                        alert(`Ваше ${field} успішно збережено.`);
                    } else {
                        console.log('Користувача не знайдено');
                    }
                }
            }
                */
            
            function editAddresses() {
                alert("Функція редагування адрес ");
            }
            
            function connectGoogle() {
                alert("прив'язка до Google.");
            }
            
            function editSocials() {
                alert(" соцмережі");
            }
            
            document.addEventListener("DOMContentLoaded", () => {
                setupEventListeners();
            });
            
            function setupEventListeners() {
                document.getElementById('update-subscriptions').addEventListener('click', updateSubscriptions);
            }
            
            function updateSubscriptions() {
                //Перевірка наявності елементів перед їх використанням
                const salesCheckbox = document.querySelector("#subscribe-sales");
                const promotionsCheckbox = document.querySelector("#subscribe-promotions");
                const newsCheckbox = document.querySelector("#subscribe-news");
            
                if (!salesCheckbox || !promotionsCheckbox || !newsCheckbox) {
                    console.error('элемент для підписок не знайдено');
                    return;
                }
            
                const subscriptions = {
                    sales: salesCheckbox.checked,
                    promotions: promotionsCheckbox.checked,
                    news: newsCheckbox.checked
                };
            
                //Збереження підписки в localStorage 
                localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions));
            
                //Виведення збережених підписок для перевірки
                const savedSubscriptions = JSON.parse(localStorage.getItem('userSubscriptions'));
                console.log('Оновлені підписки збережено:', savedSubscriptions);
            
                // Повідомлення користувача
                alert('Ваші підписки були успішно оновлені');
            }           
            
            //Вихід
            document.getElementById("logout-link").addEventListener("click", function(event) {
                event.preventDefault(); 
            
                // Очистка данних користувача
                localStorage.removeItem("user"); // змінити "user" на ім'я ключа
            
                //Повернення на головну сторінку
                window.location.href = "./index.html";
            });
            
            setupEventListeners();