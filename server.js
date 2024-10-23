const express = require('express'); // Импортируем библиотеку Express
const app = express(); // Создаем экземпляр приложения Express
const PORT = process.env.PORT || 3000; // Устанавливаем порт (по умолчанию 3000)

// Эндпоинт проверки состояния
app.get('/healthz', (req, res) => {
    res.status(200).send('OK'); // Возвращаем статус 200 и текст "OK"
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

