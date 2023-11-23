import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from './constants';
import { toast } from 'react-toastify';

const axiosWithBlockCheck = axios.create({
  baseURL: baseUrl,
});

const isBlockedToastShown = false;

axiosWithBlockCheck.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosWithBlockCheck.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.status === 403 &&
      error.response.data.error === 'You have been blocked by the admin.' &&
      !isBlockedToastShown
    ) {
      toast.error('You have been blocked by the admin.');
    }
    return Promise.reject(error);
  }
);

export default axiosWithBlockCheck;
