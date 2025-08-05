import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// const API_URL = import.meta.env.VITE_API_URL || "/api";

// Order API
export const orderAPI = {
  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get("/orders", { params });
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData: any) => {
    const response = await axios.post("/orders", orderData);
    return response.data;
  },

  assignTailor: async (orderId: string, tailorId: string) => {
    const response = await axios.put(`/orders/${orderId}/assign-tailor`, {
      tailorId,
    });
    return response.data;
  },

  updateStatus: async (orderId: string, status: string, note?: string) => {
    const response = await axios.put(`/orders/${orderId}/status`, {
      status,
      note,
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  getTailors: async () => {
    const response = await axios.get("/users/tailors");
    return response.data;
  },

  getCustomers: async () => {
    const response = await axios.get("/users/customers");
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axios.get("/users/dashboard-stats");
    return response.data;
  },
};

export const statsAPI = {
  getOrdersOverTime: async (range: string) => {
    const response = await axios.get(`/stats/orders-over-time?range=${range}`);
    return response.data;
  },
  getOrderStatusSummary: async () => {
    const response = await axios.get("/stats/orders-status-summary");
    return response.data;
  },
  getOrdersByTailor: async () => {
    const response = await axios.get("/stats/orders-by-tailor");
    return response.data;
  },
  getRevenueByVisitor: async () => {
    const response = await axios.get("/stats/revenue-by-visitor");
    return response.data;
  },
  getMyOrdersStats: async () => {
    const response = await axios.get("/stats/my-orders");
    return response.data;
  },
  getMyVisitsStats: async () => {
    const response = await axios.get("/stats/my-visits");
    return response.data;
  },
  getMyTailorOrders: async () => {
    const response = await axios.get("/stats/my-tailor-orders");
    return response.data;
  },
};

export const employeesAPI = {
  getAllEmployees: async () => {
    const response = await axios.get("/customers/people");
    return response.data;
  },
  createEmployee: async (employeeData: any) => {
    const response = await axios.post("/customers/people", employeeData);
    return response.data;
  },
};

// Set up axios defaults
axios.defaults.baseURL = API_URL;

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
