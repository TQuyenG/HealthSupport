// healthcare-support-project/server/modules/account/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve(__dirname, '../../../config/config'));

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.error('Không có token trong header Authorization');
    return res.status(401).json({ message: 'Không có token được cung cấp, vui lòng đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    console.log(`Token hợp lệ cho user ${decoded.id} (role: ${decoded.role})`);

    // Kiểm tra quyền truy cập cho endpoint /user/:id
    if (req.params.id) {
      const requestedId = parseInt(req.params.id);
      if (decoded.id !== requestedId && decoded.role !== 'admin') {
        console.error(`User ${decoded.id} không có quyền truy cập thông tin của user ${requestedId}`);
        return res.status(403).json({ message: 'Bạn không có quyền truy cập thông tin này' });
      }
    }

    next();
  } catch (error) {
    console.error(`Lỗi xác thực token: ${error.message}`);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    return res.status(401).json({ message: `Token không hợp lệ: ${error.message}` });
  }
};

module.exports = authMiddleware;