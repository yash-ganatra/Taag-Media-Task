import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Match API calls
export const matchAPI = {
  findMatches: (briefData) => api.post('/match', briefData),
  getCreators: () => api.get('/match/creators'),
  getCreatorById: (id) => api.get(`/match/creators/${id}`),
};

// Billing API calls
export const billingAPI = {
  createBrand: (brandData) => api.post('/billing/brand', brandData),
  createCreator: (creatorData) => api.post('/billing/creator', creatorData),
  getSummary: (id) => api.get(`/billing/summary/${id}`),
  getAllBillings: () => api.get('/billing/billings'),
  getInvoices: () => api.get('/billing/invoices'),
  createInvoice: (invoiceData) => api.post('/billing/invoice', invoiceData),
  downloadInvoice: (invoiceId) => api.get(`/invoice/${invoiceId}`, { responseType: 'blob' }),
};

// Invoice API calls
export const invoiceAPI = {
  generateAndDownload: (invoiceData) => api.post('/invoice', invoiceData, { responseType: 'blob' }),
};

export default api;
