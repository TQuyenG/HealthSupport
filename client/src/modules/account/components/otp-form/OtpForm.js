import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../../api/authApi';
import './OtpForm.css';

// Schema cho form 6 số riêng biệt
const schema = yup.object({
  digit1: yup.string().length(1, 'Vui lòng nhập đủ 6 chữ số').required('Bắt buộc'),
  digit2: yup.string().length(1, 'Vui lòng nhập đủ 6 chữ số').required('Bắt buộc'),
  digit3: yup.string().length(1, 'Vui lòng nhập đủ 6 chữ số').required('Bắt buộc'),
  digit4: yup.string().length(1, 'Vui lòng nhập đủ 6 chữ số').required('Bắt buộc'),
  digit5: yup.string().length(1, 'Vui lòng nhập đủ 6 chữ số').required('Bắt buộc'),
  digit6: yup.string().length(1, 'Vui lòng nhập đủ 6 chữ số').required('Bắt buộc'),
});

const OtpForm = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Thời gian gửi lại OTP (1 phút)
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // Thời gian hết hạn OTP (5 phút)
  const [canResend, setCanResend] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, identifier, isForgot } = location.state || {};
  const inputRefs = useRef([]);

  const { register, handleSubmit, setValue, watch, formState: { errors }, clearErrors } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  // Tự động focus vào ô đầu tiên khi trang tải
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Đếm ngược thời gian để gửi lại OTP (1 phút)
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Đếm ngược thời gian hết hạn OTP (5 phút)
  useEffect(() => {
    if (otpTimeLeft > 0) {
      const timer = setTimeout(() => setOtpTimeLeft(otpTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsOtpExpired(true);
      toast.error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [otpTimeLeft]);

  // Function xử lý khi nhập vào ô OTP
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;
    
    setValue(`digit${index}`, value.substring(0, 1));
    clearErrors(`digit${index}`);

    // Chuyển focus tới ô tiếp theo
    if (value && index < 6) {
      inputRefs.current[index].blur();
      inputRefs.current[index].focus();
    }
  };

  // Function xử lý khi ấn phím
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !watch(`digit${index}`) && index > 1) {
      // Nếu ấn Backspace trên ô trống, quay lại ô trước đó
      inputRefs.current[index - 2].focus();
    } else if (e.key === 'ArrowLeft' && index > 1) {
      // Xử lý phím mũi tên trái
      inputRefs.current[index - 2].focus();
    } else if (e.key === 'ArrowRight' && index < 6) {
      // Xử lý phím mũi tên phải
      inputRefs.current[index].focus();
    }
  };

  // Function paste mã OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.substring(0, 6).split('');
    digits.forEach((digit, index) => {
      if (index < 6) {
        setValue(`digit${index + 1}`, digit);
        if (index === digits.length - 1 || index === 5) {
          inputRefs.current[index].focus();
        }
      }
    });
  };

  const onSubmit = async (data) => {
    if (isOtpExpired) {
      toast.error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Ghép các chữ số thành mã OTP hoàn chỉnh
      const otp = Object.values(data).join('');
      
      if (isForgot) {
        await authApi.verifyOtpForgot({ email: identifier || email, otp });
        toast.success('Xác thực OTP thành công! Vui lòng đặt lại mật khẩu.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/reset-password', { state: { identifier: identifier || email } });
      } else {
        await authApi.verifyOtp({ email, otp });
        toast.success('Xác thực tài khoản thành công! Bạn có thể đăng nhập.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xác thực OTP thất bại!';
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

  const handleResendOtp = async () => {
    if (resendCount >= 5) {
      toast.error('Đã vượt quá giới hạn gửi lại OTP. Vui lòng thử lại sau!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setResendLoading(true);
    try {
      await authApi.resendOtp({ email: identifier || email });
      setResendCount(resendCount + 1);
      setTimeLeft(60);
      setOtpTimeLeft(300); // Reset thời gian hết hạn OTP
      setIsOtpExpired(false);
      setCanResend(false);
      toast.success('Đã gửi lại mã OTP thành công! Vui lòng kiểm tra email.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gửi lại OTP thất bại!';
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Function tạo tham chiếu cho các input
  const setRef = (index, el) => {
    inputRefs.current[index - 1] = el;
  };

  // Định dạng thời gian đếm ngược (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="otp_container">
      <div className="otp_card">
        <div className="otp_content">
          <div className="otp_left">
            <div className="otp_left_content">
              <h2>Xác Thực OTP</h2>
              <p>Vui lòng nhập mã xác thực 6 chữ số đã được gửi đến {email || identifier} để hoàn tất quá trình xác thực.</p>
              <p>Mã OTP có hiệu lực trong: <span className={isOtpExpired ? 'otp_expired' : ''}>{formatTime(otpTimeLeft)}</span></p>
            </div>
          </div>
          <div className="otp_right">
            <div className="otp_form_wrapper">
              <h2 className="otp_form_title">Nhập Mã OTP</h2>
              <p className="otp_form_subtitle">Kiểm tra email của bạn để lấy mã</p>
              <form onSubmit={handleSubmit(onSubmit)} onPaste={handlePaste}>
                <div className="otp_form_group">
                  <label>Mã xác thực <span className="otp_required">*</span></label>
                  <div className="otp_input_container">
                    {[1, 2, 3, 4, 5, 6].map((digit) => (
                      <input
                        key={digit}
                        type="text"
                        maxLength="1"
                        className={`otp_input ${errors[`digit${digit}`] ? 'otp_error_input' : ''}`}
                        {...register(`digit${digit}`)}
                        onChange={(e) => handleOtpChange(e, digit)}
                        onKeyDown={(e) => handleKeyDown(e, digit)}
                        ref={(el) => setRef(digit, el)}
                        autoComplete="off"
                        disabled={isOtpExpired}
                      />
                    ))}
                  </div>
                  {Object.keys(errors).length > 0 && (
                    <span className="otp_error">Vui lòng nhập đủ 6 chữ số</span>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || isOtpExpired} 
                  className={`otp_submit_button ${loading ? 'pulse' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="otp_spinner"></span>
                      Đang xác thực...
                    </>
                  ) : (
                    'Xác Thực'
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  disabled={resendLoading || !canResend || resendCount >= 5} 
                  className="otp_resend_button"
                >
                  {resendLoading ? (
                    <>
                      <span className="otp_spinner"></span>
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi lại OTP'
                  )}
                </button>
                
                {!canResend && timeLeft > 0 && (
                  <div className="otp_timer">
                    Gửi lại mã sau: {timeLeft} giây
                  </div>
                )}
                
                {resendCount >= 5 && (
                  <div className="otp_info_text">
                    Bạn đã vượt quá giới hạn gửi lại. Vui lòng thử lại sau.
                  </div>
                )}
                
                <div className="otp_info_text">
                  Đã nhập sai email? <Link to="/forgot-password">Quay lại</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;