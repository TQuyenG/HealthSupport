import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../../api/authApi';
import './ForgotPasswordForm.css';
import { FaEnvelope, FaKey } from 'react-icons/fa';

// Regex để kiểm tra email hợp lệ
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus vào input khi component được render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Validation email khi người dùng nhập
  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Vui lòng nhập email');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Vui lòng nhập email hợp lệ');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Xử lý khi người dùng thay đổi email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Xử lý gửi form
  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateEmail(email);
    if (!isValid) return;

    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success('Mã OTP đã được gửi đến email của bạn!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      navigate('/verify-otp', { state: { identifier: email, isForgot: true } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không tồn tại')) {
        setEmail('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra email có hợp lệ không để bật nút gửi
  const isFormValid = () => {
    return emailRegex.test(email);
  };

  return (
    <div className="forgot_pass_container">
      <div className="forgot_pass_card">
        <div className="forgot_pass_content">
          <div className="forgot_pass_left">
            <div className="forgot_pass_left_content">
              <div className="forgot_pass_icon">
                <FaKey />
              </div>
              <h2>Quên Mật Khẩu?</h2>
              <p>Đừng lo lắng! Chúng tôi sẽ giúp bạn khôi phục mật khẩu của bạn.</p>
              <p>Nhập email của bạn để nhận mã OTP.</p>
            </div>
          </div>
          <div className="forgot_pass_right">
            <div className="forgot_pass_form_wrapper">
              <h2 className="forgot_pass_form_title">Khôi Phục Tài Khoản</h2>
              <p className="forgot_pass_form_subtitle">Nhập email của bạn</p>
              <form onSubmit={onSubmit} className="forgot_pass_form">
                <div className="forgot_pass_form_group">
                  <label>Email <span className="forgot_pass_required">*</span></label>
                  <div className="forgot_pass_input_wrapper">
                    <div className="forgot_pass_input_icon">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={handleEmailChange}
                      ref={inputRef}
                      className={emailError ? 'forgot_pass_error_input' : ''}
                    />
                  </div>
                  {emailError && <span className="forgot_pass_error">{emailError}</span>}
                </div>
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="forgot_pass_submit_button"
                >
                  {loading ? (
                    <>
                      <span className="forgot_pass_spinner"></span>
                      Đang gửi OTP...
                    </>
                  ) : (
                    'Gửi OTP'
                  )}
                </button>
                <div className="forgot_pass_info_text">
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

export default ForgotPasswordForm;