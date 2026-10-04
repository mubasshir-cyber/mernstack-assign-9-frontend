import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// 1. Auth APIs
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
};

// 2. Visitors APIs
export const visitorApi = {
  getVisitors: (params) => apiClient.get('/visitors', { params }),
  getVisitor: (id) => apiClient.get(`/visitors/${id}`),
  createVisitor: (data) => apiClient.post('/visitors', data),
  updateVisitor: (id, data) => apiClient.put(`/visitors/${id}`, data),
  deleteVisitor: (id) => apiClient.delete(`/visitors/${id}`),
};

// 3. Appointments APIs
export const appointmentApi = {
  getAppointments: (params) => apiClient.get('/appointments', { params }),
  getAppointment: (id) => apiClient.get(`/appointments/${id}`),
  createAppointment: (data) => apiClient.post('/appointments', data),
  approveAppointment: (id, remarks) => apiClient.patch(`/appointments/${id}/approve`, { remarks }),
  rejectAppointment: (id, remarks) => apiClient.patch(`/appointments/${id}/reject`, { remarks }),
  cancelAppointment: (id, remarks) => apiClient.patch(`/appointments/${id}/cancel`, { remarks }),
};

// 4. Passes APIs
export const passApi = {
  getPasses: (params) => apiClient.get('/passes', { params }),
  getPass: (id) => apiClient.get(`/passes/${id}`),
  issuePass: (data) => apiClient.post('/passes', data),
  revokePass: (id) => apiClient.patch(`/passes/${id}/revoke`),
  getPdfUrl: (id) => `${BASE_URL}/passes/${id}/pdf`,
};

// 5. Security & Check-In/Out APIs
export const checklogApi = {
  checkIn: (data) => apiClient.post('/checklogs/check-in', data),
  checkOut: (data) => apiClient.post('/checklogs/check-out', data),
  getLogs: (params) => apiClient.get('/checklogs', { params }),
};

// 6. Reports & Dashboard APIs
export const reportApi = {
  getDashboardStats: () => apiClient.get('/reports/dashboard'),
  getReports: (params) => apiClient.get('/reports/appointments', { params }),
  getExportCsvUrl: (params) => {
    const query = new URLSearchParams(params).toString();
    return `${BASE_URL}/reports/export-csv?${query}`;
  },
};

// 7. Users APIs
export const userApi = {
  getUsers: () => apiClient.get('/users'),
  getHosts: () => apiClient.get('/users/hosts'),
  createUser: (data) => apiClient.post('/users', data),
};

export default apiClient;
