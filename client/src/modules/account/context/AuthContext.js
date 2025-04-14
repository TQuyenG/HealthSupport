// healthcare-support-project/client/src/modules/account/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authApi from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch dữ liệu người dùng từ API
  const fetchUserData = async (userId) => {
    try {
      const response = await authApi.getUserById(userId);
      setUser(response.data); // Lưu toàn bộ dữ liệu từ database
      console.log('Đã fetch user:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch user:', error.response?.data || error.message);
      logout(); // Đăng xuất nếu lỗi
      return null;
    }
  };

  // Hàm refresh user để gọi từ các component khác
  const refreshUser = async () => {
    if (user && user.id) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          // Fetch dữ liệu đầy đủ thay vì chỉ dùng token
          fetchUserData(decoded.id).then(() => {
            setLoading(false);
          });
        } else {
          logout();
          setLoading(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp > currentTime) {
        // Fetch dữ liệu người dùng từ API
        await fetchUserData(decoded.id);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Lỗi khi login:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};