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
            alert('Новый пользователь зарегистрирован');
            registerPopup.style.display = 'none';
            openRegisterButton.style.display = 'none';
            openLoginButton.style.display = 'none';
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
            openRegisterButton.style.display = 'none';
            openLoginButton.style.display = 'none';
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
            openRegisterButton.style.display = 'block';
            openLoginButton.style.display = 'block';
          }
        });
    });
  });
  