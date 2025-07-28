import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Order API
export const orderAPI = {
  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await axios.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData: any) => {
    const response = await axios.post('/orders', orderData);
    return response.data;
  },

  assignTailor: async (orderId: string, tailorId: string) => {
    const response = await axios.put(`/orders/${orderId}/assign-tailor`, { tailorId });
    return response.data;
  },

  updateStatus: async (orderId: string, status: string, note?: string) => {
    const response = await axios.put(`/orders/${orderId}/status`, { status, note });
    return response.data;
  }
};

// User API
export const userAPI = {
  getTailors: async () => {
    const response = await axios.get('/users/tailors');
    return response.data;
  },

  getCustomers: async () => {
    const response = await axios.get('/users/customers');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axios.get('/users/dashboard-stats');
    return response.data;
  }
};

// Set up axios defaults
axios.defaults.baseURL = API_URL;

// Request interceptor to add auth token
axios.interceptors.request.use(
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

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);