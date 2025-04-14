const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve(__dirname, '../../../config/config'));

const generateAccessToken = (user, expiresIn = '1h') => {
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn }
    );
    console.log(`Đã tạo access token cho user ${user.id}`);
    return token;
  } catch (error) {
    console.error(`Lỗi tạo access token: ${error.message}`);
    throw new Error(`Không thể tạo access token: ${error.message}`);
  }
};

const generateRefreshToken = (user) => {
  try {
    const token = jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: '7d' });
    console.log(`Đã tạo refresh token cho user ${user.id}`);
    return token;
  } catch (error) {
    console.error(`Lỗi tạo refresh token: ${error.message}`);
    throw new Error(`Không thể tạo refresh token: ${error.message}`);
  }
};

module.exports = { generateAccessToken, generateRefreshToken };