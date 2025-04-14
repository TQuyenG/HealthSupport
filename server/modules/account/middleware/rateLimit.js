const rateLimit = require('express-rate-limit');

const otpRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5, // 5 request/phút
  message: (req) => {
    console.error(`Quá số lần gửi OTP từ IP: ${req.ip}`);
    return { message: 'Quá số lần gửi OTP, vui lòng thử lại sau 1 phút' };
  },
});

module.exports = otpRateLimiter;