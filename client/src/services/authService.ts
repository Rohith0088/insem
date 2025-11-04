import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    studentId?: string;
    grade?: string;
    profilePicture?: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'admin';
  studentId?: string;
  grade?: string;
  phone?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async updateProfile(data: any) {
    const response = await api.put('/auth/profile', data);
    return response.data.user;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async getNotifications() {
    const response = await api.get('/auth/notifications');
    return response.data.notifications;
  },

  async markNotificationAsRead(notificationId: string) {
    const response = await api.put(`/auth/notifications/${notificationId}/read`);
    return response.data;
  },

  async deleteNotification(notificationId: string) {
    const response = await api.delete(`/auth/notifications/${notificationId}`);
    return response.data;
  },
};
