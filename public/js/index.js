import { handleLogin, handleLogout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateUserAccount } from './updateData.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alert.js';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const mapBox = document.getElementById('map');
const logoutBtn = document.querySelector('.nav__el--logout');
const userSettingsForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    handleLogin({ email, password });
  });
}

if (userSettingsForm) {
  userSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-settings').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('password', document.getElementById('password').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateUserAccount(form, 'data');
    document.querySelector('.btn--save-settings').textContent = 'Save settings';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    let currentPassword = document.getElementById('password-current').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('password-confirm').value;
    await updateUserAccount(
      { currentPassword, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
    e.target.textContent = 'Book tour now!';
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alert) showAlert('success', alertMessage, 10);
