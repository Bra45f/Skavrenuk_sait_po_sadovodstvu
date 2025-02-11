const sqlite3 = require('sqlite3').verbose();

// Создаем или подключаемся к базе данных
const db = new sqlite3.Database('./store.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('База данных подключена.');
  }
});

// Создаем таблицы
db.serialize(() => {
  // Таблица пользователей
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);
});

module.exports = db;
