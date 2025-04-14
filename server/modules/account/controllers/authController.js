const bcrypt = require('bcrypt');
const { User, Permission, RolePermission } = require('../models/AccountModel');
const nodemailer = require('nodemailer');
const { generateAccessToken, generateRefreshToken } = require('../services/tokenService');
const { Sequelize } = require('sequelize');
const config = require('../../../config/config');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Danh sách avatar hợp lệ
const VALID_AVATARS = [
  'd1.jpg', 'd2.jpg', 'd3.jpg', 'd4.jpg', 'd5.jpg',
  'd6.jpg', 'd7.jpg', 'd8.jpg', 'd9.jpg', 'd10.jpg',
  'd11.jpg', 'd12.jpg', 'd13.jpg', 'd14.jpg', 'd15.jpg',
  'd16.jpg', 'd17.jpg', 'd18.jpg', 'd19.jpg', 'd20.jpg'
];

const register = async (req, res) => {
  const { email, phone, username, password, gender, address } = req.body;

  try {
    if (!email || !password) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Email, mật khẩu là bắt buộc' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.error(`Email đã tồn tại: ${email}`);
      return res.status(400).json({ message: 'Email đã được đăng ký trước đó' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      phone,
      username,
      password: hashedPassword,
      role: 'patient',
      status: 'inactive',
      gender,
      address,
      avatar: 'd1.jpg',
    });

    const otp = generateOTP();
    req.otpCache.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'Xác thực tài khoản',
      text: `Mã OTP của bạn là: ${otp}. Hết hạn sau 5 phút.`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Đăng ký thành công cho ${email}, OTP: ${otp}`);
    res.status(201).json({ message: 'Đăng ký thành công, vui lòng kiểm tra email để nhận OTP' });
  } catch (error) {
    console.error(`Lỗi khi đăng ký cho ${email}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi đăng ký: ${error.message}` });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Email và OTP là bắt buộc' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`Không tìm thấy người dùng: ${email}`);
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    if (user.status === 'active') {
      console.error(`Tài khoản đã kích hoạt: ${email}`);
      return res.status(400).json({ message: 'Tài khoản đã được kích hoạt trước đó' });
    }

    const otpData = req.otpCache.get(email);
    if (!otpData || otpData.otp !== otp || otpData.expires < Date.now()) {
      console.error(`OTP không hợp lệ hoặc đã hết hạn cho ${email}`);
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    await user.update({ status: 'active' });
    req.otpCache.del(email);
    console.log(`Xác thực OTP thành công cho ${email}`);
    res.status(200).json({ message: 'Xác thực OTP thành công, tài khoản đã được kích hoạt' });
  } catch (error) {
    console.error(`Lỗi khi xác thực OTP cho ${email}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi xác thực OTP: ${error.message}` });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`Không tìm thấy người dùng: ${email}`);
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    if (user.status === 'active') {
      console.error(`Tài khoản đã kích hoạt: ${email}`);
      return res.status(400).json({ message: 'Tài khoản đã được kích hoạt trước đó' });
    }

    const otp = generateOTP();
    req.otpCache.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'Gửi lại mã OTP',
      text: `Mã OTP mới của bạn là: ${otp}. Hết hạn sau 5 phút.`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi lại OTP cho ${email}: ${otp}`);
    res.status(200).json({ message: 'Mã OTP mới đã được gửi đến email của bạn' });
  } catch (error) {
    console.error(`Lỗi khi gửi lại OTP cho ${email}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi gửi lại OTP: ${error.message}` });
  }
};

const login = async (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  try {
    if (!identifier || !password) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Thông tin đăng nhập và mật khẩu là bắt buộc' });
    }

    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: identifier }, { phone: identifier }, { username: identifier }],
      },
    });
    if (!user) {
      console.error(`Không tìm thấy người dùng với identifier: ${identifier}`);
      return res.status(404).json({ message: 'Thông tin đăng nhập không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error(`Mật khẩu không đúng cho ${identifier}`);
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }

    if (user.status === 'inactive') {
      await user.update({ status: 'active', last_login: new Date() });
    } else {
      await user.update({ last_login: new Date() });
    }

    const accessToken = generateAccessToken(user, rememberMe ? '7d' : '1h');
    const refreshToken = rememberMe ? generateRefreshToken(user) : null;

    console.log(`Đăng nhập thành công cho ${identifier}`);
    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(`Lỗi khi đăng nhập với ${identifier}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi đăng nhập: ${error.message}` });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`Không tìm thấy người dùng: ${email}`);
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    const otp = generateOTP();
    req.otpCache.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'Đặt lại mật khẩu',
      text: `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}. Hết hạn sau 5 phút.`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi OTP quên mật khẩu cho ${email}: ${otp}`);
    res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn để đặt lại mật khẩu' });
  } catch (error) {
    console.error(`Lỗi khi gửi OTP quên mật khẩu cho ${email}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi gửi OTP quên mật khẩu: ${error.message}` });
  }
};

const verifyOTPForgot = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Email và OTP là bắt buộc' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`Không tìm thấy người dùng: ${email}`);
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    const otpData = req.otpCache.get(email);
    if (!otpData || otpData.otp !== otp || otpData.expires < Date.now()) {
      console.error(`OTP không hợp lệ hoặc đã hết hạn cho ${email}`);
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    req.otpCache.del(email);
    console.log(`Xác thực OTP quên mật khẩu thành công cho ${email}`);
    res.status(200).json({ message: 'Xác thực OTP thành công, bạn có thể đặt lại mật khẩu' });
  } catch (error) {
    console.error(`Lỗi khi xác thực OTP quên mật khẩu cho ${email}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi xác thực OTP quên mật khẩu: ${error.message}` });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      console.error('Dữ liệu không đầy đủ');
      return res.status(400).json({ message: 'Email và mật khẩu mới là bắt buộc' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`Không tìm thấy người dùng: ${email}`);
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });
    console.log(`Đã đặt lại mật khẩu cho ${email}`);
    res.status(200).json({ message: 'Đặt lại mật khẩu thành công, bạn có thể đăng nhập với mật khẩu mới' });
  } catch (error) {
    console.error(`Lỗi khi đặt lại mật khẩu cho ${email}: ${error.message}`);
    res.status(500).json({ message: `Lỗi server khi đặt lại mật khẩu: ${error.message}` });
  }
};

const getPermissionsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const rolePermissions = await RolePermission.findAll({
      where: { role },
      include: [
        {
          model: Permission,
          attributes: ['name', 'module', 'description'],
        },
      ],
    });

    const permissions = rolePermissions.map(rp => ({
      name: rp.Permission.name,
      module: rp.Permission.module,
      description: rp.Permission.description || '',
    }));
    console.log(`Quyền của ${role}:`, permissions);
    res.status(200).json(permissions);
  } catch (error) {
    console.error(`Lỗi khi lấy quyền của vai trò ${req.params.role}:`, error);
    res.status(500).json({ message: 'Không thể lấy quyền', error: error.message });
  }
};

const getAllRolePermissions = async (req, res) => {
  try {
    const roles = ['admin', 'staff', 'doctor', 'patient'];
    const allPermissions = {};

    for (const role of roles) {
      const rolePermissions = await RolePermission.findAll({
        where: { role },
        include: [
          {
            model: Permission,
            attributes: ['name', 'module', 'description'],
          },
        ],
      });
      allPermissions[role] = rolePermissions.map(rp => ({
        name: rp.Permission.name,
        module: rp.Permission.module,
        description: rp.Permission.description || '',
      }));
    }
    console.log('Tất cả quyền:', allPermissions);
    res.status(200).json(allPermissions);
  } catch (error) {
    console.error('Lỗi khi lấy quyền của tất cả vai trò:', error);
    res.status(500).json({ message: 'Không thể lấy quyền của tất cả vai trò', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'status'],
    });
    console.log('Danh sách users:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách users:`, error);
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  const { username, email, password, role, status } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Tất cả các trường (trừ status) là bắt buộc' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      status: 'inactive',
    });

    console.log(`Thêm người dùng thành công: ${email}`);
    res.status(201).json({ message: 'Thêm người dùng thành công', user: { id: user.id, username, email, role, status: 'inactive' } });
  } catch (error) {
    console.error(`Lỗi khi thêm người dùng ${email}:`, error);
    res.status(500).json({ message: 'Lỗi server khi thêm người dùng', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    phone,
    full_name,
    dob,
    gender,
    address,
    avatar,
    role,
    status,
  } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.error(`Không tìm thấy người dùng với ID: ${id}`);
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.error(`Email đã tồn tại: ${email}`);
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }
    }

    // Log avatar nhận được
    console.log(`Nhận avatar cho user ${id}: ${avatar}`);

    // Validate avatar
    if (avatar && !VALID_AVATARS.includes(avatar)) {
      console.error(`Avatar không hợp lệ: ${avatar}`);
      return res.status(400).json({ message: `Avatar không hợp lệ. Chỉ chấp nhận: ${VALID_AVATARS.join(', ')}` });
    }

    // Kiểm tra file ảnh tồn tại
    if (avatar) {
      const avatarPath = path.join(__dirname, '../../../public/avatars', avatar);
      console.log(`Kiểm tra file ảnh tại: ${avatarPath}`);
      if (!fs.existsSync(avatarPath)) {
        console.warn(`File ảnh không tồn tại tại: ${avatarPath}`);
        // Không trả về lỗi, chỉ log cảnh báo
      }
    }

    const updateData = {
      username: username !== undefined ? username : user.username,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      full_name: full_name !== undefined ? full_name : user.full_name,
      dob: dob !== undefined ? dob : user.dob,
      gender: gender !== undefined ? gender : user.gender,
      address: address !== undefined ? address : user.address,
      avatar: avatar || user.avatar || 'd1.jpg', // Fallback rõ ràng
      role: role || user.role,
      status: status || user.status,
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
    };

    console.log('Dữ liệu gửi để cập nhật:', updateData);
    await user.update(updateData);

    const updatedUser = await User.findByPk(id);
    console.log('Dữ liệu sau khi cập nhật:', updatedUser.toJSON());

    res.status(200).json({
      message: 'Cập nhật người dùng thành công',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        full_name: updatedUser.full_name,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        status: updatedUser.status,
        last_login: updatedUser.last_login,
      },
    });
  } catch (error) {
    console.error(`Lỗi khi cập nhật người dùng ${id}:`, error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.error(` không tìm thấy người dùng với ID: ${id}`);
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await user.destroy();
    console.log(`Xóa người dùng thành công: ${id}`);
    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error(`Lỗi khi xóa người dùng ${id}:`, error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng', error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'email',
        'phone',
        'username',
        'full_name',
        'dob',
        'role',
        'status',
        'avatar',
        'gender',
        'address',
        'last_login',
      ],
    });

    if (!user) {
      console.error(`Không tìm thấy người dùng với ID: ${id}`);
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    console.log(`Lấy thông tin người dùng thành công: ${user.email}`);
    res.status(200).json(user);
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin người dùng ${id}:`, error.message);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng', error: error.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  verifyOTPForgot,
  resetPassword,
  getPermissionsByRole,
  getAllRolePermissions,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
};