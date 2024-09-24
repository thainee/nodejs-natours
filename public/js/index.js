import { handleLogin, handleLogout } from './login.js';
import { displayMap } from './mapbox.js';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const mapBox = document.getElementById('map');
const logoutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    handleLogin({ email, password });
  });
}

if (logoutBtn) {
  addEventListener('click', async () => {
    handleLogout();
  });
}