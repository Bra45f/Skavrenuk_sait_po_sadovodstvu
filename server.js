document.addEventListener('DOMContentLoaded', () => {
    const openCartButton = document.getElementById('open-cart');
    const cartPopup = document.getElementById('cart-popup');
    const closePopupButton = cartPopup.querySelector('.close');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart-button');
    let cart = []; // Локальная корзина пользователя
  
    // Открыть popup
    openCartButton.addEventListener('click', event => {
      event.preventDefault();
      renderCart();
      cartPopup.style.display = 'block';
    });
  
    // Закрыть popup
    closePopupButton.addEventListener('click', () => {
      cartPopup.style.display = 'none';
    });
  
    // Закрыть popup при клике вне его области
    window.addEventListener('click', event => {
      if (event.target === cartPopup) {
        cartPopup.style.display = 'none';
      }
    });
  
    // Добавление товара в корзину
    document.querySelectorAll('.cart-button').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseInt(button.dataset.productPrice, 10);
  
        // Проверяем, есть ли уже товар в корзине
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
      });
    });
  
    // Очистить корзину
    clearCartButton.addEventListener('click', () => {
      if (confirm('Вы действительно хотите очистить корзину?')) {
        cart = [];
        renderCart();
      }
    });
  
    // Удалить товар из корзины
    function removeItem(productId) {
      cart = cart.filter(item => item.id !== productId);
      renderCart();
    }
  
    // Рендер корзины
    function renderCart() {
      cartItemsContainer.innerHTML = ''; // Очистить список товаров
      let total = 0;
  
      cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-quantity">${item.quantity} x ${item.price} ₽</span>
          <button class="remove-item-button" data-product-id="${item.id}">Удалить</button>
        `;
        cartItemsContainer.appendChild(li);
  
        total += item.quantity * item.price;
  
        // Добавить обработчик для кнопки "Удалить"
        li.querySelector('.remove-item-button').addEventListener('click', () => {
          removeItem(item.id);
        });
      });
  
      totalPriceElement.textContent = `Итого: ${total} ₽`;
    }
  });
  