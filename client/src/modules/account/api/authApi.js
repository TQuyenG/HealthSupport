// healthcare-support-project/client/src/modules/account/api/authApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào mỗi request
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  register: (data) => authApi.post('/register', data),
  verifyOtp: (data) => authApi.post('/verify-otp', data),
  resendOtp: (data) => authApi.post('/resend-otp', data),
  login: (data) => authApi.post('/login', data),
  forgotPassword: (data) => authApi.post('/forgot-password', data),
  verifyOtpForgot: (data) => authApi.post('/verify-otp-forgot', data),
  resetPassword: (data) => authApi.post('/reset-password', data),
  getPermissionsByRole: (role) => authApi.get(`/permissions/${role}`),
  getAllRolePermissions: () => authApi.get('/permissions/all-roles'),
  getUsers: () => {
    console.log('Đang lấy danh sách người dùng từ:', `${API_URL}/users`);
    return authApi.get('/users');
  },
  addUser: (data) => authApi.post('/users', data),
  updateUser: (id, data) => {
    console.log('Đang cập nhật người dùng:', `${API_URL}/users/${id}`, data);
    return authApi.put(`/users/${id}`, data);
  },
  deleteUser: (id) => {
    console.log('Đang xóa người dùng:', `${API_URL}/users/${id}`);
    return authApi.delete(`/users/${id}`);
  },
  getUserById: (id) => {
    console.log('Đang lấy thông tin người dùng từ:', `${API_URL}/user/${id}`);
    return authApi.get(`/user/${id}`);
  },
};