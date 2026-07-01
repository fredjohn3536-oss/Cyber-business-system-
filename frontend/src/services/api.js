import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

// Categories
export const categoriesAPI = {
  list: () => api.get('/api/categories'),
  get: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Products
export const productsAPI = {
  list: (params) => api.get('/api/products', { params }),
  get: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

// Sales
export const salesAPI = {
  list: () => api.get('/api/sales'),
  get: (id) => api.get(`/api/sales/${id}`),
  create: (data) => api.post('/api/sales', data),
};

// Dashboard
export const dashboardAPI = {
  stats: () => api.get('/api/dashboard/stats'),
};

// Stock
export const stockAPI = {
  movements: (params) => api.get('/api/stock/movements', { params }),
  createMovement: (data) => api.post('/api/stock/movements', data),
};

// Admin
export const adminAPI = {
  listUsers: () => api.get('/api/admin/users'),
  createUser: (data) => api.post('/api/admin/users', data),
  toggleUserStatus: (id) => api.put(`/api/admin/users/${id}/status`),
  getBusiness: () => api.get('/api/admin/business'),
  updateBusiness: (data) => api.put('/api/admin/business', data),
  auditLogs: () => api.get('/api/admin/audit-logs'),
};
