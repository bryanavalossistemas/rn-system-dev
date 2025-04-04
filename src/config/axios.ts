import useStore from '@/store';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (useStore.getState().token) {
      config.headers.Authorization = `Bearer ${useStore.getState().token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        useStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
