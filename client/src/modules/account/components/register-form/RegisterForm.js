import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../../api/authApi';
import './RegisterForm.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHeartbeat } from 'react-icons/fa';

// Đã đơn giản hoá schema, chỉ yêu cầu email và mật khẩu
const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu không khớp').required('Xác nhận mật khẩu là bắt buộc'),
});

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Theo dõi giá trị mật khẩu để hiển thị đánh giá độ mạnh
  const watchPassword = watch('password', '');
  
  // Tính độ mạnh mật khẩu
  const calculateStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    
    // Độ dài
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    
    // Có chữ hoa
    if (/[A-Z]/.test(password)) score += 1;
    
    // Có số
    if (/[0-9]/.test(password)) score += 1;
    
    // Có ký tự đặc biệt
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 4);
  };
  
  const passwordStrength = calculateStrength(watchPassword);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
      });
      
      // Cấu hình toast ở góc phải dưới
      toast.success('Đăng ký thành công, vui lòng kiểm tra email để nhận OTP!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-content">
          <div className="register-left">
            <div className="register-left-content">
              <div className="register-logo">
                <FaHeartbeat className="register-logo-icon" />
                <span>MediCare</span>
              </div>
              <h1 className="register-greeting-title">Chào mừng đến MediCare</h1>
              <p className="register-greeting-subtitle">Hãy đăng ký để trải nghiệm dịch vụ chăm sóc sức khỏe tốt nhất từ đội ngũ bác sĩ chuyên nghiệp.</p>
              <div className="register-image"></div>
              <p className="register-link-text">
                Đã có tài khoản? <Link to="/login" className="register-link">Đăng nhập</Link>
              </p>
            </div>
          </div>
          
          <div className="register-right">
            <div className="register-form-wrapper">
              <h2 className="register-title">Tạo tài khoản mới</h2>
              <p className="register-subtitle">Điền thông tin cần thiết để đăng ký</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="register-form" noValidate>
                <div className="register-form-group">
                  <div className="register-input-wrapper">
                    <div className="register-input-icon">
                      <FaEnvelope />
                    </div>
                    <input 
                      {...register('email')} 
                      type="email" 
                      placeholder="Nhập email của bạn"
                      className={errors.email ? 'error-input' : ''}
                    />
                  </div>
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                </div>
                
                <div className="register-form-group">
                  <div className="register-input-wrapper">
                    <div className="register-input-icon">
                      <FaLock />
                    </div>
                    <input 
                      {...register('password')} 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Nhập mật khẩu"
                      className={errors.password ? 'error-input' : ''}
                    />
                    <div 
                      className="register-password-toggle" 
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {errors.password && <span className="error-message">{errors.password.message}</span>}
                </div>
                
                {watchPassword && (
                  <div className="register-password-strength">
                    <div className="register-strength-label">
                      Độ mạnh: 
                      <span className={`register-strength-text register-strength-${passwordStrength}`}>
                        {passwordStrength === 0 && "Rất yếu"}
                        {passwordStrength === 1 && "Yếu"}
                        {passwordStrength === 2 && "Trung bình"}
                        {passwordStrength === 3 && "Mạnh"}
                        {passwordStrength === 4 && "Rất mạnh"}
                      </span>
                    </div>
                    <div className="register-strength-meter">
                      <div className={`register-strength-bar ${passwordStrength >= 1 ? 'active' : ''}`}></div>
                      <div className={`register-strength-bar ${passwordStrength >= 2 ? 'active' : ''}`}></div>
                      <div className={`register-strength-bar ${passwordStrength >= 3 ? 'active' : ''}`}></div>
                      <div className={`register-strength-bar ${passwordStrength >= 4 ? 'active' : ''}`}></div>
                    </div>
                  </div>
                )}
                
                <div className="register-form-group">
                  <div className="register-input-wrapper">
                    <div className="register-input-icon">
                      <FaLock />
                    </div>
                    <input 
                      {...register('confirmPassword')} 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Xác nhận mật khẩu"
                      className={errors.confirmPassword ? 'error-input' : ''}
                    />
                    <div 
                      className="register-password-toggle" 
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                </div>
                
                <div className="register-terms-privacy">
                  <label className="register-terms-label">
                    <input type="checkbox" id="terms" required />
                    <span className="register-checkmark"></span>
                    Tôi đồng ý với <Link to="/terms" className="register-terms-link">Điều khoản sử dụng</Link> và <Link to="/privacy" className="register-terms-link">Chính sách bảo mật</Link>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className={`register-button ${loading ? 'loading' : ''}`} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="register-spinner"></span>
                      Đang đăng ký...
                    </>
                  ) : 'Đăng Ký'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;