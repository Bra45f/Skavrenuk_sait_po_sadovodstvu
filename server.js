const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Страница входа
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Страница регистрации
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

// Личный кабинет
app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.sendFile(__dirname + '/public/profile.html');
  } else {
    res.redirect('/login');
  }
});

// Регистрация пользователя
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Хеширование пароля
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Ошибка сервера');
    }

    // Сохранение пользователя в БД
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.run(query, [username, hashedPassword, email], function(err) {
      if (err) {
        return res.status(500).send('Ошибка регистрации');
      }
      res.redirect('/login');
    });
  });
});

// Вход пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Получаем пользователя из базы данных
  const query = 'SELECT * FROM users WHERE username = ?';
  db.get(query, [username], (err, user) => {
    if (err || !user) {
      return res.status(400).send('Пользователь не найден');
    }

    // Сравнение паролей
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).send('Неверный пароль');
      }

      // Устанавливаем сессию
      req.session.user = user;
      res.redirect('/profile');
    });
  });
});

// Выход из аккаунта
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Ошибка при выходе');
    }
    res.redirect('/');
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
    res.json();
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
  console.log(`Запсук сервера... Адресс сервера: http://localhost:${PORT}`);
});
