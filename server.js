const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Пользовательские маршруты
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Пользователь уже существует!' });
    }
    res.json({ success: true, message: 'Регистрация успешна!' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Неверный email или пароль!' });
    }

    req.session.user = user; // Сохраняем данные пользователя в сессии
    res.json({ success: true, user });
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка выхода из системы.' });
    }
    res.json({ success: true, message: 'Вы успешно вышли.' });
  });
});

// Работа с корзиной
app.post('/cart', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Пожалуйста, войдите в систему!' });
  }

  const { product_id, quantity } = req.body;
  const user_id = req.session.user.id;

  const query = `INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)`;
  db.run(query, [user_id, product_id, quantity], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Ошибка добавления в корзину!' });
    }
    res.json({ success: true, message: 'Товар добавлен в корзину.' });
  });
});

app.get('/cart', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Пожалуйста, войдите в систему!' });
  }

  const user_id = req.session.user.id;

  const query = `SELECT * FROM carts WHERE user_id = ?`;
  db.all(query, [user_id], (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка получения корзины!' });
    }
    res.json({ success: true, items });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
