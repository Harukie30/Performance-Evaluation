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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (userData: { email: string; password: string; role: string }) =>
    api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
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