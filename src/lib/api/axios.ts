import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://be-restaurant-production.up.railway.app', // URL Backend Railway kamu
  headers: {
    'Content-Type': 'application/json',
  },
});

// Otomatis menyelipkan token ke setiap request jika user sudah login
api.interceptors.request.use(
  (config) => {
    // Mengambil token dari browser cookie
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    const token = match ? match[2] : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
