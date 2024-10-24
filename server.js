const express = require('express');
const path = require('path'); // Импортируем модуль path для работы с путями

const app = express();
const PORT = process.env.PORT || 3000;

// Указываем папку для статических файлов (например, public или текущая директория)
app.use(express.static(__dirname)); 

// Эндпоинт для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Отправляем файл index.html
});

// Эндпоинт проверки состояния
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
