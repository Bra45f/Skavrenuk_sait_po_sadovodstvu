document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const registerPopup = document.getElementById('register-popup');
    const loginPopup = document.getElementById('login-popup');
    const userInfo = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
  
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout');
  
    const openRegisterButton = document.getElementById('open-register');
    const openLoginButton = document.getElementById('open-login');
  
    // Показать/скрыть попапы
    openRegisterButton.addEventListener('click', () => {
      registerPopup.style.display = 'block';
      loginPopup.style.display = 'none';
    });
  
    openLoginButton.addEventListener('click', () => {
      loginPopup.style.display = 'block';
      registerPopup.style.display = 'none';
    });
  
    // Регистрация
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
  
      fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Регистрация успешна! Теперь вы можете войти.');
            registerPopup.style.display = 'none';
          } else {
            alert(data.error || 'Ошибка регистрации.');
          }
        });
    });
  
    // Вход
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
  
      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            userNameSpan.textContent = data.user.name;
            userInfo.style.display = 'block';
            loginPopup.style.display = 'none';
            alert('Вы успешно вошли!');
          } else {
            alert(data.error || 'Ошибка входа.');
          }
        });
    });
  
    // Выход
    logoutButton.addEventListener('click', () => {
      fetch('/logout', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            userInfo.style.display = 'none';
            alert('Вы успешно вышли из системы.');
          }
        });
    });
  });
  