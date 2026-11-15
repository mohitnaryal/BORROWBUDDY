import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('borrowbuddy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized and not already on login
    if (
      error.response &&
      error.response.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      // Clear token if invalid or expired
      if (localStorage.getItem('borrowbuddy_token')) {
        localStorage.removeItem('borrowbuddy_token');
        localStorage.removeItem('borrowbuddy_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
