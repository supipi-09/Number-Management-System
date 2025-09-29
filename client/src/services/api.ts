import axios from "axios";
import {
  User,
  NumberRecord,
  NumberLog,
  DashboardStats,
  LoginCredentials,
  ApiResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    _id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin" as const,
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    username: "planner",
    email: "planner@example.com",
    role: "planner" as const,
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

const mockNumbers: NumberRecord[] = [
  {
    _id: "1",
    number: "0711234567",
    status: "Available",
    serviceType: "LTE",
    specialType: "Gold",
    allocatedTo: undefined,
    remarks: "Sample number 1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    number: "0712345678",
    status: "Allocated",
    serviceType: "IPTL",
    specialType: "Platinum",
    allocatedTo: "Customer A",
    remarks: "Sample number 2",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

const mockLogs: NumberLog[] = [
  {
    _id: "1",
    number: "0711234567",
    action: "Allocated",
    performedBy: {
      _id: "1",
      username: "admin",
    },
    timestamp: "2024-01-01T00:00:00.000Z",
    notes: "Number allocated to customer",
  },
];

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    // Mock login - accept any credentials
    const user = mockUsers[0];
    return {
      success: true,
      data: {
        user,
        token: "mock-jwt-token",
      },
      message: "Login successful",
    };
  },

  register: async (
    userData: Partial<User> & { password: string }
  ): Promise<ApiResponse<User>> => {
    const newUser: User = {
      _id: Date.now().toString(),
      username: userData.username || "",
      email: userData.email || "",
      role: (userData.role as "admin" | "planner") || "planner",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: newUser,
      message: "User created successfully",
    };
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return {
      success: true,
      data: mockUsers[0],
      message: "User profile retrieved successfully",
    };
  },

  updateProfile: async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const updatedUser = { ...mockUsers[0], ...userData };
    return {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    };
  },
};

// Numbers API
export const numbersAPI = {
  getNumbers: async (filters?: any): Promise<ApiResponse<NumberRecord[]>> => {
    // Mock response with filters
    let filteredNumbers = [...mockNumbers];
    if (filters?.status) {
      filteredNumbers = filteredNumbers.filter(
        (n) => n.status === filters.status
      );
    }
    if (filters?.serviceType) {
      filteredNumbers = filteredNumbers.filter(
        (n) => n.serviceType === filters.serviceType
      );
    }
    return {
      success: true,
      data: filteredNumbers,
      message: "Numbers retrieved successfully",
    };
  },

  getNumber: async (id: string): Promise<ApiResponse<NumberRecord>> => {
    const number = mockNumbers.find((n) => n._id === id);
    if (!number) {
      return {
        success: false,
        message: "Number not found",
      };
    }
    return {
      success: true,
      data: number,
      message: "Number retrieved successfully",
    };
  },

  updateNumber: async (
    id: string,
    data: Partial<NumberRecord>
  ): Promise<ApiResponse<NumberRecord>> => {
    const index = mockNumbers.findIndex((n) => n._id === id);
    if (index === -1) {
      return {
        success: false,
        message: "Number not found",
      };
    }
    const updatedNumber = {
      ...mockNumbers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockNumbers[index] = updatedNumber;
    return {
      success: true,
      data: updatedNumber,
      message: "Number updated successfully",
    };
  },

  createNumber: async (
    data: Partial<NumberRecord>
  ): Promise<ApiResponse<NumberRecord>> => {
    const newNumber: NumberRecord = {
      _id: Date.now().toString(),
      number: data.number || "",
      status: data.status || "Available",
      serviceType: data.serviceType || "LTE",
      specialType: data.specialType || "Standard",
      allocatedTo: data.allocatedTo,
      remarks: data.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockNumbers.push(newNumber);
    return {
      success: true,
      data: newNumber,
      message: "Number created successfully",
    };
  },

  deleteNumber: async (id: string): Promise<ApiResponse<void>> => {
    const index = mockNumbers.findIndex((n) => n._id === id);
    if (index === -1) {
      return {
        success: false,
        message: "Number not found",
      };
    }
    mockNumbers.splice(index, 1);
    return {
      success: true,
      message: "Number deleted successfully",
    };
  },

  importNumbers: async (
    file: File
  ): Promise<
    ApiResponse<{ success: number; failed: number; errors: string[] }>
  > => {
    // Mock import response
    return {
      success: true,
      data: {
        success: 10,
        failed: 2,
        errors: ["Invalid format in row 5", "Duplicate number in row 8"],
      },
      message: "Numbers imported successfully",
    };
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const stats: DashboardStats = {
      totalNumbers: mockNumbers.length,
      allocatedNumbers: mockNumbers.filter((n) => n.status === "Allocated")
        .length,
      availableNumbers: mockNumbers.filter((n) => n.status === "Available")
        .length,
      reservedNumbers: mockNumbers.filter((n) => n.status === "Reserved")
        .length,
      heldNumbers: mockNumbers.filter((n) => n.status === "Held").length,
      quarantinedNumbers: mockNumbers.filter((n) => n.status === "Quarantined")
        .length,
    };
    return {
      success: true,
      data: stats,
      message: "Stats retrieved successfully",
    };
  },
};

// Logs API
export const logsAPI = {
  getLogs: async (filters?: any): Promise<ApiResponse<NumberLog[]>> => {
    let filteredLogs = [...mockLogs];
    if (filters?.number) {
      filteredLogs = filteredLogs.filter((l) => l.number === filters.number);
    }
    if (filters?.action) {
      filteredLogs = filteredLogs.filter((l) => l.action === filters.action);
    }
    return {
      success: true,
      data: filteredLogs,
      message: "Logs retrieved successfully",
    };
  },

  getNumberLogs: async (number: string): Promise<ApiResponse<NumberLog[]>> => {
    const numberLogs = mockLogs.filter((l) => l.number === number);
    return {
      success: true,
      data: numberLogs,
      message: "Number logs retrieved successfully",
    };
  },
};

// Users API
export const usersAPI = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return {
      success: true,
      data: mockUsers,
      message: "Users retrieved successfully",
    };
  },

  createUser: async (
    userData: Partial<User> & { password: string }
  ): Promise<ApiResponse<User>> => {
    const newUser: User = {
      _id: Date.now().toString(),
      username: userData.username || "",
      email: userData.email || "",
      role: (userData.role as "admin" | "planner") || "planner",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return {
      success: true,
      data: newUser,
      message: "User created successfully",
    };
  },

  updateUser: async (
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const index = mockUsers.findIndex((u) => u._id === id);
    if (index === -1) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const updatedUser = { ...mockUsers[index], ...userData };
    mockUsers[index] = updatedUser;
    return {
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    };
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const index = mockUsers.findIndex((u) => u._id === id);
    if (index === -1) {
      return {
        success: false,
        message: "User not found",
      };
    }
    mockUsers.splice(index, 1);
    return {
      success: true,
      message: "User deleted successfully",
    };
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async (): Promise<ApiResponse<DashboardStats>> => {
    const stats: DashboardStats = {
      totalNumbers: mockNumbers.length,
      allocatedNumbers: mockNumbers.filter((n) => n.status === "Allocated")
        .length,
      availableNumbers: mockNumbers.filter((n) => n.status === "Available")
        .length,
      reservedNumbers: mockNumbers.filter((n) => n.status === "Reserved")
        .length,
      heldNumbers: mockNumbers.filter((n) => n.status === "Held").length,
      quarantinedNumbers: mockNumbers.filter((n) => n.status === "Quarantined")
        .length,
    };
    return {
      success: true,
      data: stats,
      message: "Dashboard summary retrieved successfully",
    };
  },

  getAnalytics: async (): Promise<ApiResponse<any>> => {
    const analytics = {
      monthlyAllocation: [
        { month: "Jan", allocated: 45 },
        { month: "Feb", allocated: 52 },
        { month: "Mar", allocated: 38 },
        { month: "Apr", allocated: 61 },
        { month: "May", allocated: 55 },
        { month: "Jun", allocated: 67 },
      ],
      serviceTypeDistribution: [
        { name: "LTE", value: 35 },
        { name: "IPTL", value: 25 },
        { name: "FTTH/Copper", value: 40 },
      ],
      statusDistribution: [
        { name: "Available", value: 40 },
        { name: "Allocated", value: 35 },
        { name: "Reserved", value: 15 },
        { name: "Held", value: 7 },
        { name: "Quarantined", value: 3 },
      ],
    };
    return {
      success: true,
      data: analytics,
      message: "Analytics retrieved successfully",
    };
  },
};

export default api;
