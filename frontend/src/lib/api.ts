import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('citadental_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (expired/invalid token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('citadental_token');
      localStorage.removeItem('citadental_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/registro')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ── Public ──
export const publicAPI = {
  getClinic: () => api.get('/clinic'),
  getServices: () => api.get('/services'),
  getAvailability: (date: string, duration: number) =>
    api.get('/availability', { params: { date, duration } }),
  submitContact: (data: { name: string; email: string; phone?: string; message: string }) =>
    api.post('/contact', data),
};

// ── Patient ──
export const patientAPI = {
  getProfile: () => api.get('/me/profile'),
  getAppointments: (status?: string) =>
    api.get('/me/appointments', { params: status ? { status } : {} }),
  createAppointment: (data: { serviceId: string; date: string; startTime: string; notes?: string }) =>
    api.post('/me/appointments', data),
  cancelAppointment: (id: string) =>
    api.patch(`/me/appointments/${id}/cancel`),
};

// ── Admin ──
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAppointments: (params?: Record<string, string>) =>
    api.get('/admin/appointments', { params }),
  updateAppointmentStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/admin/appointments/${id}/status`, { status, notes }),
  createManualAppointment: (data: { userId: string; serviceId: string; date: string; startTime: string; notes?: string }) =>
    api.post('/admin/appointments/manual', data),
  getPatients: (params?: Record<string, string>) => api.get('/admin/patients', { params }),

  // Services
  getAllServices: () => api.get('/admin/services'),
  createService: (data: any) => api.post('/admin/services', data),
  updateService: (id: string, data: any) => api.patch(`/admin/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`),

  // Schedule
  getSchedule: () => api.get('/admin/schedule'),
  updateSchedule: (hours: any[]) => api.post('/admin/schedule', { hours }),
  createBlock: (data: { date: string; startTime: string; endTime: string; reason?: string }) => api.post('/admin/schedule/blocks', data),
  deleteBlock: (id: string) => api.delete(`/admin/schedule/blocks/${id}`),

  // Clinic settings
  getClinicSettings: () => api.get('/admin/clinic'),
  updateClinicSettings: (data: any) => api.patch('/admin/clinic', data),
};

// ── Notifications ──
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;
