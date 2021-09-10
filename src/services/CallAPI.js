import axios from 'axios';
import config from '../constants/config';

const callApi = (endpoint, method, body) => {
    return axios({
        method: method,
        url: config.API_URL + endpoint,
        data: body
    }).catch(err => {
        throw err;
    });
}
export default callApi;
