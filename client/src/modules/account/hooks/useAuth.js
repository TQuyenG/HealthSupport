// healthcare-support-project/client/src/modules/account/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../api/authApi';

const useAuth = () => {
  const { user, login, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (credentials, rememberMe) => {
    try {
      const { data } = await authApi.login({ ...credentials, rememberMe });
      console.log('Login response:', data); // Debug
      login(data.accessToken, data.refreshToken);
      const role = data.user.role;
      toast.success('Đăng nhập thành công!');
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Đã đăng xuất!');
    navigate('/login');
  };

  return { user, loading, handleLogin, handleLogout };
};

export default useAuth;