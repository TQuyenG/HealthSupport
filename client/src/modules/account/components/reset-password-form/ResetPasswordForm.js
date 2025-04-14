import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../../api/authApi';
import './ResetPasswordForm.css';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object({
  password: yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier } = location.state || {};

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const password = watch('password', '');

  const calculateStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  };

  useEffect(() => {
    setPasswordStrength(calculateStrength(password));
  }, [password]);

  // Kiểm tra nếu không có identifier (email)
  useEffect(() => {
    if (!identifier) {
      toast.error('Không tìm thấy email. Vui lòng thực hiện lại quá trình quên mật khẩu!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/forgot-password');
    }
  }, [identifier, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.resetPassword({ email: identifier, password: data.password });
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Cập nhật mật khẩu thất bại! Vui lòng thử lại.';
      toast.error(errorMessage, {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="reset_pass_container">
      <div className="reset_pass_card">
        <div className="reset_pass_content">
          <div className="reset_pass_left">
            <div className="reset_pass_left_content">
              <h2>Đặt Lại Mật Khẩu</h2>
              <p>Vui lòng nhập mật khẩu mới để tiếp tục sử dụng tài khoản của bạn.</p>
              <p>Mật khẩu cần ít nhất 8 ký tự và bao gồm ít nhất 1 số để đảm bảo an toàn.</p>
            </div>
          </div>
          <div className="reset_pass_right">
            <div className="reset_pass_form_wrapper">
              <h2 className="reset_pass_form_title">Cập Nhật Mật Khẩu</h2>
              <p className="reset_pass_form_subtitle">Nhập mật khẩu mới của bạn</p>
              <form onSubmit={handleSubmit(onSubmit)} className="reset_pass_form">
                <div className="reset_pass_form_group">
                  <div className="reset_pass_input_wrapper">
                    <div className="reset_pass_input_icon">
                      <FaLock />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu mới"
                      className={errors.password ? 'reset_pass_error_input' : ''}
                    />
                    <div
                      className="reset_pass_password_toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {errors.password && <span className="reset_pass_error">{errors.password.message}</span>}
                  {password && (
                    <div className="reset_pass_strength">
                      <div className="reset_pass_strength_label">
                        Độ mạnh:
                        <span className={`reset_pass_strength_text reset_pass_strength_${passwordStrength}`}>
                          {passwordStrength === 0 && "Rất yếu"}
                          {passwordStrength === 1 && "Yếu"}
                          {passwordStrength === 2 && "Trung bình"}
                          {passwordStrength === 3 && "Mạnh"}
                          {passwordStrength === 4 && "Rất mạnh"}
                        </span>
                      </div>
                      <div className="reset_pass_strength_meter">
                        <div className={`reset_pass_strength_bar ${passwordStrength >= 1 ? 'active' : ''}`}></div>
                        <div className={`reset_pass_strength_bar ${passwordStrength >= 2 ? 'active' : ''}`}></div>
                        <div className={`reset_pass_strength_bar ${passwordStrength >= 3 ? 'active' : ''}`}></div>
                        <div className={`reset_pass_strength_bar ${passwordStrength >= 4 ? 'active' : ''}`}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="reset_pass_form_group">
                  <div className="reset_pass_input_wrapper">
                    <div className="reset_pass_input_icon">
                      <FaLock />
                    </div>
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Xác nhận mật khẩu"
                      className={errors.confirmPassword ? 'reset_pass_error_input' : ''}
                    />
                    <div
                      className="reset_pass_password_toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {errors.confirmPassword && <span className="reset_pass_error">{errors.confirmPassword.message}</span>}
                </div>
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className={`reset_pass_submit_button ${loading ? 'reset_pass_pulse' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="reset_pass_spinner"></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập Nhật Mật Khẩu'
                  )}
                </button>
                <button
                  type="button"
                  className="reset_pass_cancel_button"
                  onClick={() => navigate('/login')}
                >
                  Hủy
                </button>
                <div className="reset_pass_info_text">
                  Đã nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;