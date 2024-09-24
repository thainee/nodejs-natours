/* eslint-disable */
import { showAlert } from './alert.js';

export async function handleLogin(data) {
  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/api/v1/users/login`,
      data,
    );

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 800);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
}

export async function handleLogout() {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/v1/users/logout`,
    );

    if (response.data.status === 'success') {
      location.reload(true);
      showAlert('success', 'Logged out successfully!');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
}
