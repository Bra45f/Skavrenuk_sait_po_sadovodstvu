const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./database');
const bcrypt = require('bcryptjs');


// Настройка Express
const app = express();
const port = 3000;

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

// Старт сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
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

app.get('/', (req, res) => {
  if (req.session.user) {
      res.sendFile(__dirname + '/public/index_logged.html'); // Отображаем другую главную страницу для авторизованных
  } else {
      res.sendFile(__dirname + '/public/index.html');
  }
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login'); // Если пользователь не вошел, отправляем его на страницу входа
  }
  res.sendFile(__dirname + '/public/profile.html');
});

app.get('/user', (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ message: "Не авторизован" });
  }
  res.json({ username: req.session.user.username, email: req.session.user.email });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).send("Ошибка при выходе");
      }
      res.redirect('/');
  });
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
    res.redirect('/login');
  });
});