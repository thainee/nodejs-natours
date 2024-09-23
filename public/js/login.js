/* eslint-disable */
import { showAlert } from './alert.js';

const formDocument = document.querySelector('.form');
const baseUrl = formDocument.dataset.base_url;

async function handleLogin(data) {
  try {
    const response = await axios.post(`${baseUrl}/api/v1/users/login`, data);

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
}

formDocument.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  handleLogin({ email, password });
});
