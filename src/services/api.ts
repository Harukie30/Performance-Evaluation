import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  // Get token from cookie
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 errors if we're not on the login page
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Clear any stored user data
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log("Making login API call...");
      console.log("Request payload:", { email, password: password ? "[REDACTED]" : "undefined" });
      
      const response = await api.post('/auth/login', { email, password });
      console.log("Login API response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      return response;
    } catch (error: any) {
      console.error("Login API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config,
        isAxiosError: error.isAxiosError,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  },
  register: (userData: { email: string; password: string; role: string }) =>
    api.post('/auth/register', userData),
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },
  getCurrentUser: () => api.get('/auth/me'),
  logout: async () => {
    try {
      await api.post('/auth/logout');
      // Clear any stored user data
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, redirect to login
      window.location.href = '/login';
    }
  },
};

// Employee API calls
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (employeeData: any) => api.post('/employees', employeeData),
  update: (id: string, employeeData: any) => api.put(`/employees/${id}`, employeeData),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Performance Review API calls
export const reviewAPI = {
  getAll: (params?: { employeeId?: string; status?: string }) => 
    api.get('/performance-review', { params }),
  getById: (id: string) => api.get(`/performance-review/${id}`),
  create: (reviewData: any) => api.post('/performance-review', reviewData),
  update: (id: string, reviewData: any) => api.put(`/performance-review/${id}`, reviewData),
  delete: (id: string) => api.delete(`/performance-review/${id}`),
  submitForHR: (id: string) => api.post(`/performance-review/${id}/submit`),
  approve: (id: string) => api.post(`/performance-review/${id}/approve`),
  reject: (id: string, reason: string) => 
    api.post(`/performance-review/${id}/reject`, { reason }),
  getRecent: () => api.get('/performance-review/recent'),
};

export default api; 