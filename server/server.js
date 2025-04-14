const path = require('path');
const config = require(path.resolve(__dirname, 'config/config'));
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./modules/account/routes/authRoutes');
const otpRateLimiter = require('./modules/account/middleware/rateLimit');
const seedData = require('./database/seed');
const NodeCache = require('node-cache');

const app = express();

// Khởi tạo bộ nhớ tạm cho OTP
const otpCache = new NodeCache({
  stdTTL: 300, // OTP hết hạn sau 5 phút (300 giây)
  checkperiod: 60, // Kiểm tra và xóa OTP hết hạn mỗi 60 giây
});

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục public/avatars
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

// Log để debug yêu cầu ảnh
app.use('/avatars', (req, res, next) => {
  console.log(`Yêu cầu ảnh: ${req.originalUrl}`);
  next();
});

// Middleware giới hạn số lần gửi OTP
app.use('/api/auth/resend-otp', otpRateLimiter);
app.use('/api/auth/forgot-password', otpRateLimiter);

// Truyền otpCache vào routes để sử dụng
app.use('/api/auth', (req, res, next) => {
  req.otpCache = otpCache;
  next();
}, authRoutes);

// Xử lý route không tồn tại
app.use((req, res) => {
  console.error(`Route không tồn tại: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route không tồn tại: ${req.method} ${req.originalUrl}` });
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
  console.error(`Lỗi server không mong muốn: ${err.message}`);
  res.status(500).json({ message: `Lỗi server không mong muốn: ${err.message}` });
});

const PORT = config.port;

sequelize
  .sync({ force: true }) // Lần đầu chạy với force: true để tạo lại bảng
  .then(async () => {
    console.log('Database synced');
    await seedData();
    app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));
  })
  .catch((err) => {
    console.error(`Lỗi khi đồng bộ database: ${err.message}`);
    process.exit(1);
  });