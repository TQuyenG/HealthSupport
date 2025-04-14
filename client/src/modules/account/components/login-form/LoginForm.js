import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import './LoginForm.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object({
  identifier: yup.string()
    .required('Vui lòng nhập email, số điện thoại hoặc tên đăng nhập')
    .trim(),
  password: yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .trim(),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await handleLogin(data, rememberMe);
      // Chỉ hiển thị toast thành công ở đây
      toast.success('Đăng nhập thành công!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      reset();
    } catch (error) {
      // Hiển thị thông báo lỗi từ server
      const errorMessage = error.message || 'Thông tin đăng nhập hoặc mật khẩu không đúng';
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-content">
          <div className="login-left">
            <div className="login-left-content">
              <h1 className="greeting-title">Chào mừng trở lại</h1>
              <p className="greeting-subtitle">Đăng nhập để tiếp tục hành trình chăm sóc sức khỏe của bạn.</p>
              <div className="login-image"></div>
              <p className="register-link-text">
                Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký ngay</Link>
              </p>
            </div>
          </div>
          
          <div className="login-right">
            <div className="login-form-wrapper">
              <h2 className="login-title">Đăng Nhập</h2>
              <p className="login-subtitle">Vui lòng nhập thông tin đăng nhập</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
                <div className="login-form-group">
                  <div className="login-input-wrapper">
                    <div className="login-input-icon">
                      <FaUser />
                    </div>
                    <input 
                      {...register('identifier')}
                      type="text"
                      placeholder="Email, số điện thoại hoặc tên đăng nhập"
                      className={errors.identifier ? 'error-input' : ''}
                      disabled={isSubmitting || loading}
                    />
                  </div>
                  {errors.identifier && <span className="error-message">{errors.identifier.message}</span>}
                </div>
                
                <div className="login-form-group">
                  <div className="login-input-wrapper">
                    <div className="login-input-icon">
                      <FaLock />
                    </div>
                    <input 
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      className={errors.password ? 'error-input' : ''}
                      disabled={isSubmitting || loading}
                    />
                    <div 
                      className="password-toggle" 
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {errors.password && <span className="error-message">{errors.password.message}</span>}
                </div>
                
                <div className="form-options">
                  <label className="remember-me">
                    <input 
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isSubmitting || loading}
                    />
                    <span className="checkmark"></span>
                    Ghi nhớ đăng nhập
                  </label>
                  <Link to="/forgot-password" className="forgot-password">Quên mật khẩu?</Link>
                </div>
                
                <button 
                  type="submit"
                  className={`login-button ${loading ? 'loading' : ''}`}
                  disabled={loading || isSubmitting}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng Nhập'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;