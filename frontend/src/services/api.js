import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  signin: (credentials) => api.post('/auth/signin', credentials),
};

// User APIs
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (userData) => api.patch('/users/me', userData),
  getUsers: () => api.get('/users'),
};

// Account APIs
export const accountAPI = {
  getBalance: () => api.get('/account/balance'),
};

// Transaction APIs
export const transactionAPI = {
  transfer: (transferData) => api.post('/transactions/transfer', transferData),
  getTransactions: (page = 1, limit = 10) => 
    api.get('/transactions', { params: { page, limit } }),
};

export default api;
