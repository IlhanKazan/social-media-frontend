import axios from 'axios';

const api = axios.create({
  baseURL: 'https://social-media-api-k62i.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor'ı
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 