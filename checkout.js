function showStep(stepId) {
    const steps = document.querySelectorAll('.checkout__step');
    steps.forEach(step => {
        step.style.display = 'none';
    });

    const currentStep = document.getElementById(stepId);
    currentStep.style.display = 'block';
}

function toggleDeliveryOptions() {
    const deliveryMethod = document.getElementById('delivery-method').value;
    const addressInfo = document.getElementById('address-info');
    const novaPoshtaInfo = document.querySelector('.checkout__nova-poshta');

    addressInfo.style.display = 'none';
    novaPoshtaInfo.style.display = 'none';

    if (deliveryMethod === 'address') {
        addressInfo.style.display = 'block';
    } else if (deliveryMethod === 'nova-poshta') {
        novaPoshtaInfo.style.display = 'block';
    }
}
// Перевірка валідності форми
function isFormValid(formId) {
    const form = document.getElementById(formId);
    return form.checkValidity(); // Перевіряє всі поля з атрибутом required
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (isFormValid('contact-form')) {
        showStep('delivery-step');
    } else {
        alert('Будь ласка, заповніть всі обов\'язкові поля.');
    }
});

document.getElementById('delivery-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (isFormValid('delivery-form')) {
        showStep('payment-step');
    } else {
        alert('Будь ласка, заповніть всі обов\'язкові поля.');
    }
});

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    showStep('delivery-step');
});

document.getElementById('delivery-form').addEventListener('submit', function(event) {
    event.preventDefault();
    showStep('payment-step');
});
document.addEventListener('DOMContentLoaded', async function() {
    const apiKey = '2599b2f73544bcafa6e43a3e07475f1a'; //  API ключ
    const baseURL = 'https://api.novaposhta.ua/v2.0/json/'; // URL API Нової Пошти

    // Функція для отримання списку міст
    const getCities = async () => {
        try {
            const response = await axios.post(baseURL, {
                apiKey: apiKey,
                modelName: 'Address',
                calledMethod: 'getCities',
                methodProperties: {}
            });
            return response.data.data;
        } catch (error) {
            console.error('Помилка отримання міст:', error);
        }
    };

    // Функція для отримання відділень вибраного міста
    const getBranches = async (cityRef) => {
        try {
            const response = await axios.post(baseURL, {
                apiKey: apiKey,
                modelName: 'Address',
                calledMethod: 'getWarehouses',
                methodProperties: { CityRef: cityRef }
            });
            return response.data.data;
        } catch (error) {
            console.error('Помилка отримання відділень:', error);
        }
    };

    // Функція для відображення списку, що випадає
    const displayDropdown = (dropdownId, items, onClick) => {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '';

        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.Description;
            div.dataset.ref = item.Ref;
            div.addEventListener('click', () => {
                onClick(item);
                dropdown.style.display = 'none'; // Приховати список, що випадає після вибору
            });
            dropdown.appendChild(div);
        });

        dropdown.style.display = items.length ? 'block' : 'none'; // Показати або приховати список
    };

    //Функція для фільтрації за введеними символами 
    const filterOptions = async (inputId, dropdownId, fetchData, filterFn) => {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);

        input.addEventListener('input', async () => {
            const query = input.value.toLowerCase();
            const items = await fetchData();
            const filteredItems = items.filter(item =>
                filterFn(item, query)
            );
            displayDropdown(dropdownId, filteredItems, (selectedItem) => {
                input.value = selectedItem.Description;
                if (dropdownId === 'nova-poshta-city-dropdown') {
                    //Завантаження відділень для вибраного міста 
                    getBranches(selectedItem.Ref).then(branches => {
                        displayDropdown('nova-poshta-branch-dropdown', branches, (selectedBranch) => {
                            document.getElementById('nova-poshta-branch-search').value = selectedBranch.Description;
                        });
                    });
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!input.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    };

    //Функція фільтрації для міст
    const cityFilterFn = (item, query) => {
        //Пошук за першими літерами опису міста, ігноруючи область 
        const description = item.Description.split(',')[0].toLowerCase();
        return description.startsWith(query);
    };

    //Функція фільтрації для відділень 
    const branchFilterFn = (item, query) => {
        //Пошук за першими цифрами відділення 
        const description = item.Description.replace(/\D/g, '').substring(0, query.length);
        return description.startsWith(query);
    };

    // Ініціалізація пошуку міст та відділень
    const cities = await getCities();
    filterOptions('nova-poshta-city-search', 'nova-poshta-city-dropdown', () => Promise.resolve(cities), cityFilterFn);
    
    //Ініціалізація пошуку відділень
    filterOptions('nova-poshta-branch-search', 'nova-poshta-branch-dropdown', async () => {
        const selectedCity = document.getElementById('nova-poshta-city-search').value;
        const selectedCityRef = cities.find(city => city.Description.split(',')[0].toLowerCase() === selectedCity.toLowerCase())?.Ref;
        if (selectedCityRef) {
            return await getBranches(selectedCityRef);
        }
        return [];
    }, branchFilterFn);
    // Промокод
    
        const promoCodes = {
            'SUMMER10': 10,
            'WINTER15': 15,
            // Додайте інші промокоди та знижки
        };
    
        
        document.querySelector('.checkout__promo-button').addEventListener('click', function() {
            const promoCodeInput = document.getElementById('promo-code');
            const promoCode = promoCodeInput.value.trim().toUpperCase();
            const discount = promoCodes[promoCode];
    
            if (discount !== undefined) {
                applyDiscount(discount);
            } else {
                alert('Неправильний промокод');
            }
        });
        const applyDiscount = (discount) => {
            // Зберігаємо знижку в data-атрибуті
            document.getElementById('promo-code').dataset.discount = discount;
            // Оновлюємо відображення замовлення з урахуванням знижки
            displayOrderItems();
        };
    
        const updateDeliveryInfo = (totalAmount) => {
            const deliveryInfo = document.querySelector('.checkout__summary-item .checkout__summary-amount');
            if (totalAmount > 3000) {
                deliveryInfo.textContent = 'Безкоштовно';
            } else {
                deliveryInfo.textContent = '100 грн'; // Орієнтовна вартість доставки
            }
        };
    
        // Функція для відображення товарів у розділі оформлення замовлення
        const displayOrderItems = () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || {};
            let orderItemsContainer = document.getElementById('order-items-container');
            let totalAmount = 0;
            let discount = parseFloat(document.getElementById('promo-code').dataset.discount) || 0; // Получаем скидку от промокода
            let deliveryCost = 100; //Стандартна вартість доставки 
            let bonusInput = document.getElementById('bonus-input');
            let bonusPayment = parseFloat(bonusInput.value) || 0; // Оплата бонусами
            
            orderItemsContainer.innerHTML = ''; //Очистити контейнер перед додаванням нових елементів
        
            if (Object.keys(cart).length === 0) {
                orderItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
            } else {
                for (let productId in cart) {
                    let item = cart[productId];
                    let { name, price, quantity } = item;
    
                    let subtotal = quantity * price;
                    let discountAmount = (subtotal * discount) / 100; // Застосування знижки до кожного товару
                    let discountedSubtotal = subtotal - discountAmount;
                    totalAmount += discountedSubtotal;
    
                    let itemDiv = document.createElement('div');
                    itemDiv.className = 'checkout__order-item';
                    itemDiv.innerHTML = `
                        <p class="checkout__order-item-name">${name || 'Название товара'}</p>
                        <p class="checkout__order-item-price">${price.toLocaleString()} грн</p>
                        <p class="checkout__order-item-quantity">Кількість: ${quantity}</p>
                        <p class="checkout__order-item-subtotal">Сума: ${discountedSubtotal.toLocaleString()} грн</p>
                    `;
    
                    orderItemsContainer.appendChild(itemDiv);
                }
    
                let totalDiv = document.createElement('div');
                totalDiv.className = 'checkout__order-total';
                totalDiv.innerHTML = `Разом з урахуванням знижки: ${totalAmount.toLocaleString()} грн`;
                orderItemsContainer.appendChild(totalDiv);
    
                //Оновлюємо інформацію про доставку 
                updateDeliveryInfo(totalAmount);
    
                // Оновлюємо загальну суму до оплати
                let deliveryFee = deliveryCost;
                if (totalAmount > 3000) {
                    deliveryFee = 0;
                }
    
                let totalToPay = totalAmount + deliveryFee;
                document.getElementById('total-to-pay').textContent = totalToPay.toLocaleString() + ' грн';
            }
        };
    
        // Завантажуємо та відображаємо дані при завантаженні сторінки
        displayOrderItems();
    
        document.querySelector('.checkout__button').addEventListener('click', function(event) {
            event.preventDefault(); // Запобігаємо стандартній поведінці форми
            //Створюємо об'єкт замовлення 
            const orderId = Date.now(); // Використовуємо поточний час як унікальний ID
            const cart = JSON.parse(localStorage.getItem('cart')) || {};
            const totalAmount = document.querySelector('.checkout__order-total').textContent.split(': ')[1];
            const userInfo = {
                name: document.getElementById('user-name').value,
                phone: document.getElementById('user-phone').value,
                email: document.getElementById('user-email').value,
                city: document.getElementById('city').value,
                deliveryMethod: document.getElementById('delivery-method').value,
                
                
               
                totalToPay: totalAmount
            };
    
            const order = {
                id: orderId,
                status: "Замовлення отримано",
                totalAmount: totalAmount,
                items: Object.keys(cart).map(productId => {
                    const item = cart[productId];
                    return {
                        name: item.name || 'Назва товару',
                        price: item.price,
                        quantity: item.quantity
                    };
                }),
                statusHistory: [
                    { status: "Новий", date: new Date().toLocaleDateString() }
                ],
                userInfo: userInfo
            };
    
            // Отримуємо існуючі замовлення
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            //Додаємо нове замовлення до масиву замовлень 
            orders.push(order);
            // Зберігаємо оновлений масив замовлень у LocalStorage
            localStorage.setItem('orders', JSON.stringify(orders));
    
            //Очищення кошика після оформлення замовлення
            localStorage.removeItem('cart');
    
            alert('Ваше замовлення було успішно оформлене!');
            // Перенаправлення або оновлення сторінки
            window.location.href = '/index.html'; //Перенаправлення на головну 
        });
    });

console.log(localStorage.getItem('cart'));