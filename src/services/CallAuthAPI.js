import axios from 'axios';
import config from '../constants/config';

const callAuthAPI = (endpoint, method, body) => {
  const token = localStorage.getItem('TOKEN');
  if (!token) return;
  try {
    return axios({
      method: method,
      url: config.API_URL + endpoint,
      data: body,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
  } catch (err) {
    throw err;
  }
}

export default callAuthAPI;
