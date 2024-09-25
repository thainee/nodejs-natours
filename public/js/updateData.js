/* eslint-disable */
import { showAlert } from './alert.js';

export async function updateUserAccount(data, type) {
  try {
    let url = `${process.env.BASE_URL}/api/v1/users`;
    url += type === 'password' ? '/update-password' : '/update-me';
    const res = await axios.patch(url, data);

    if (res.data.status === 'success') {
      showAlert('success', `${type} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
