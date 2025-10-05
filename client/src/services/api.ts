import axios from "axios";
import {
  User,
  NumberRecord,
  NumberLog,
  DashboardStats,
  LoginCredentials,
  ApiResponse,
} from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (
    userData: Partial<User> & { password: string }
  ): Promise<ApiResponse<User>> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await api.put("/auth/update", userData);
    return response.data;
  },
};

// Numbers API
export const numbersAPI = {
  getNumbers: async (filters?: any): Promise<ApiResponse<NumberRecord[]>> => {
    const response = await api.get("/numbers", { params: filters });
    return response.data;
  },

  getNumber: async (id: string): Promise<ApiResponse<NumberRecord>> => {
    const response = await api.get(`/numbers/${id}`);
    return response.data;
  },

  updateNumber: async (
    id: string,
    data: Partial<NumberRecord>
  ): Promise<ApiResponse<NumberRecord>> => {
    const response = await api.put(`/numbers/${id}`, data);
    return response.data;
  },

  createNumber: async (
    data: Partial<NumberRecord>
  ): Promise<ApiResponse<NumberRecord>> => {
    const response = await api.post("/numbers", data);
    return response.data;
  },

  deleteNumber: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/numbers/${id}`);
    return response.data;
  },

  importNumbers: async (
    file: File
  ): Promise<
    ApiResponse<{ success: number; failed: number; errors: string[] }>
  > => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/numbers/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get("/numbers/stats/summary");
    return response.data;
  },
};

// Logs API
export const logsAPI = {
  getLogs: async (filters?: any): Promise<ApiResponse<NumberLog[]>> => {
    const response = await api.get("/logs", { params: filters });
    return response.data;
  },

  getNumberLogs: async (number: string): Promise<ApiResponse<NumberLog[]>> => {
    const response = await api.get(`/logs/number/${number}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get("/users");
    return response.data;
  },

  createUser: async (
    userData: Partial<User> & { password: string }
  ): Promise<ApiResponse<User>> => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  getAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get("/dashboard/analytics");
    return response.data;
  },
};

export default api;
