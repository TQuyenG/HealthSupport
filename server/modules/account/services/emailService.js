const nodemailer = require('nodemailer');
const path = require('path');
const config = require(path.resolve(__dirname, '../../../config/config'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: config.emailUser,
    to,
    subject: 'Mã OTP xác thực',
    text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi OTP ${otp} tới ${to}`);
    return true;
  } catch (error) {
    console.error(`Lỗi gửi email tới ${to}: ${error.message}`);
    throw new Error(`Không thể gửi email OTP: ${error.message}`);
  }
};

module.exports = { sendOTPEmail };