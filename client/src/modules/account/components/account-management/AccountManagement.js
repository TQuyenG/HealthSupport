import React, { useState, useEffect, useContext } from 'react';
import { FaTrash, FaSave, FaTimes, FaLock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import './AccountManagement.css';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

// Cập nhật danh sách ảnh mặc định
const DEFAULT_AVATARS = [
  'd1.jpg', 'd2.jpg', 'd3.jpg', 'd4.jpg', 'd5.jpg',
  'd6.jpg', 'd7.jpg', 'd8.jpg', 'd9.jpg', 'd10.jpg',
  'd11.jpg', 'd12.jpg', 'd13.jpg', 'd14.jpg', 'd15.jpg',
  'd16.jpg', 'd17.jpg', 'd18.jpg', 'd19.jpg', 'd20.jpg'
];

const AccountManagement = ({ user, onClose }) => {
  const { setUser } = useContext(AuthContext);
  const [account, setAccount] = useState(null);
  const [editingFields, setEditingFields] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const navigate = useNavigate();

  // Original account data for comparison
  const [originalAccount, setOriginalAccount] = useState(null);

  // Ngăn cuộn trang khi popup hiển thị
  useEffect(() => {
    // Áp dụng overflow: hidden cho body khi component được mount
    document.body.style.overflow = 'hidden';
    
    // Khôi phục overflow khi component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (user) {
      setAccount(user);
      setOriginalAccount(JSON.parse(JSON.stringify(user)));
      setSelectedAvatar(user.avatar || 'd1.jpg');
    }
  }, [user]);

  useEffect(() => {
    if (selectedAvatar && selectedAvatar !== account?.avatar) {
      console.log('Đồng bộ avatar:', selectedAvatar);
      setAccount(prev => ({ ...prev, avatar: selectedAvatar }));
      setHasChanges(true);
    }
  }, [selectedAvatar, account]);

  const toggleFieldEdit = (field) => {
    setEditingFields({
      ...editingFields,
      [field]: !editingFields[field]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value || null });
    setErrors({ ...errors, [name]: undefined });
    setHasChanges(true);
  };

  const handleAvatarSelect = (avatar) => {
    console.log('Chọn avatar:', avatar);
    setSelectedAvatar(avatar);
    setAccount(prev => ({ ...prev, avatar }));
    setHasChanges(true);
    setShowAvatarSelector(false);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return value && /\S+@\S+\.\S+/.test(value) ? null : 'Email không hợp lệ';
      case 'phone':
        return value && !/^\d{10,11}$/.test(value) ? 'Số điện thoại phải có 10-11 chữ số' : null;
      case 'dob':
        return value && new Date(value) > new Date() ? 'Ngày sinh không hợp lệ' : null;
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {};

    if (!account.email || !/\S+@\S+\.\S+/.test(account.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (account.phone && !/^\d{10,11}$/.test(account.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    if (account.dob && new Date(account.dob) > new Date()) {
      newErrors.dob = 'Ngày sinh không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveField = async (fieldName) => {
    const error = validateField(fieldName, account[fieldName]);

    if (error) {
      setErrors({ ...errors, [fieldName]: error });
      toast.error(error, { position: 'bottom-right', autoClose: 3000 });
      return;
    }

    try {
      const updatedData = { [fieldName]: account[fieldName] };
      await authApi.updateUser(account.id, updatedData);

      toast.success(`Cập nhật ${getFieldLabel(fieldName)} thành công!`, {
        position: 'bottom-right',
        autoClose: 2000,
      });

      setEditingFields({ ...editingFields, [fieldName]: false });
      setOriginalAccount({ ...originalAccount, [fieldName]: account[fieldName] });
      setHasChanges(false);
    } catch (error) {
      toast.error(`Không thể cập nhật ${getFieldLabel(fieldName)}!`, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      email: 'Email',
      phone: 'Số điện thoại',
      username: 'Tên đăng nhập',
      full_name: 'Họ và tên',
      dob: 'Ngày sinh',
      gender: 'Giới tính',
      address: 'Địa chỉ',
      avatar: 'Ảnh đại diện'
    };
    return labels[fieldName] || fieldName;
  };

  const handleSaveAvatar = async () => {
    try {
      await authApi.updateUser(account.id, { avatar: selectedAvatar });

      toast.success('Cập nhật ảnh đại diện thành công!', {
        position: 'bottom-right',
        autoClose: 2000,
      });

      setOriginalAccount({ ...originalAccount, avatar: selectedAvatar });
      setHasChanges(false);

      // Cập nhật user trong AuthContext
      setUser(prev => ({ ...prev, avatar: selectedAvatar }));
    } catch (error) {
      toast.error('Không thể cập nhật ảnh đại diện!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleUpdateAllChanges = async () => {
    if (!validateAllFields()) {
      toast.error('Vui lòng kiểm tra lại thông tin!', {
        position: 'bottom-right',
        autoClose: 3000
      });
      return;
    }

    try {
      const updatedData = {
        username: account.username || null,
        email: account.email,
        phone: account.phone || null,
        full_name: account.full_name || null,
        dob: account.dob || null,
        gender: account.gender || null,
        address: account.address || null,
        avatar: selectedAvatar || account.avatar || 'd1.jpg'
      };
      console.log('Gửi updatedData:', updatedData);

      await authApi.updateUser(account.id, updatedData);

      // Cập nhật state cục bộ
      setAccount(prev => ({ ...prev, ...updatedData }));
      setOriginalAccount(prev => ({ ...prev, ...updatedData }));

      // Cập nhật user trong AuthContext
      setUser(prev => ({ ...prev, ...updatedData }));

      toast.success('Cập nhật tài khoản thành công!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEditingFields({});
      setErrors({});
      setHasChanges(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Không thể cập nhật tài khoản!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const confirmDeleteAccount = () => {
    setIsDeleteConfirmOpen(true);
  };

  const cancelDeleteAccount = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await authApi.deleteUser(account.id);
      toast.success('Tài khoản đã được xóa!', {
        position: 'bottom-right',
        autoClose: 3000
      });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa tài khoản!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const handleChangeAvatar = () => {
    setShowAvatarSelector(!showAvatarSelector);
  };

  const handleDeleteAvatar = () => {
    setSelectedAvatar('d1.jpg');
    setAccount({ ...account, avatar: 'd1.jpg' });
    setHasChanges(true);
    toast.info('Ảnh đại diện đã được đặt về mặc định', {
      position: 'bottom-right',
      autoClose: 2000
    });
  };

  if (!user) {
    return null;
  }

  if (!account) {
    return (
      <div className="account_management_loading">
        <div className="spinner"></div>
        <span>Đang tải thông tin tài khoản...</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="account_management_popup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ToastContainer />

        <motion.div
          className="account_management_popup_content"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
          <div className="account_management_close" onClick={onClose}>
            <FaTimes />
          </div>

          <div className="account_management_header">
            <h2>TÀI KHOẢN</h2>
            <p className="account_subtitle">Chỉnh sửa thông tin cá nhân của bạn</p>
          </div>

          <div className="account_management_layout">
            <div className="account_management_sidebar">
              <div className="account_management_avatar_container">
                <motion.div
                  className="avatar_wrapper"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={`http://localhost:5000/avatars/${selectedAvatar || 'd1.jpg'}?t=${new Date().getTime()}`}
                    alt="Avatar"
                    className="account_management_avatar"
                    onError={(e) => {
                      console.error(`Lỗi tải ảnh avatar: http://localhost:5000/avatars/${selectedAvatar}`);
                      e.target.src = 'http://localhost:5000/avatars/d1.jpg';
                    }}
                  />
                </motion.div>

                <div className="account_management_avatar_buttons">
                  <button
                    className="change_avatar_button"
                    onClick={handleChangeAvatar}
                  >
                    Thay đổi ảnh đại diện
                  </button>
                  <button
                    className="delete_avatar_button"
                    onClick={handleDeleteAvatar}
                  >
                    Xóa ảnh đại diện
                  </button>

                  <button
                    className="change_password_button"
                    onClick={handleResetPassword}
                  >
                    <FaLock /> Đổi mật khẩu
                  </button>
                </div>

                <AnimatePresence>
                  {showAvatarSelector && (
                    <motion.div
                      className="account_management_avatar_selector_container"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="account_management_avatar_selector">
                        {DEFAULT_AVATARS.map((avatar) => (
                          <motion.img
                            key={avatar}
                            src={`http://localhost:5000/avatars/${avatar}`}
                            alt={`Avatar ${avatar}`}
                            className={`account_management_avatar_option ${
                              selectedAvatar === avatar ? 'selected' : ''
                            }`}
                            onClick={() => handleAvatarSelect(avatar)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            onError={(e) => {
                              console.error(`Lỗi tải ảnh avatar: http://localhost:5000/avatars/${avatar}`);
                              e.target.src = 'http://localhost:5000/avatars/d1.jpg';
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="account_management_main_content">
              <div className="account_management_form_fields">
                <div className="account_management_form_grid">
                  <div className="account_management_form_column left_column">
                    <div className="account_management_form_group">
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        name="full_name"
                        value={account.full_name || ''}
                        onChange={handleInputChange}
                        className={errors.full_name ? 'account_management_input_error' : ''}
                      />
                      {errors.full_name && <span className="account_management_error_message">{errors.full_name}</span>}
                    </div>

                    <div className="account_management_form_group">
                      <label>Tên đăng nhập</label>
                      <input
                        type="text"
                        name="username"
                        value={account.username || ''}
                        onChange={handleInputChange}
                        className={errors.username ? 'account_management_input_error' : ''}
                      />
                      {errors.username && <span className="account_management_error_message">{errors.username}</span>}
                    </div>

                    <div className="account_management_form_group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={account.email || ''}
                        onChange={handleInputChange}
                        className={errors.email ? 'account_management_input_error' : ''}
                      />
                      {errors.email && <span className="account_management_error_message">{errors.email}</span>}
                    </div>

                    <div className="account_management_form_group">
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        name="phone"
                        value={account.phone || ''}
                        onChange={handleInputChange}
                        className={errors.phone ? 'account_management_input_error' : ''}
                      />
                      {errors.phone && <span className="account_management_error_message">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="account_management_form_column right_column">
                    <div className="account_management_form_group">
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="dob"
                        value={account.dob ? new Date(account.dob).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className={errors.dob ? 'account_management_input_error' : ''}
                      />
                      {errors.dob && <span className="account_management_error_message">{errors.dob}</span>}
                    </div>

                    <div className="account_management_form_group">
                      <label>Giới tính</label>
                      <select
                        name="gender"
                        value={account.gender || ''}
                        onChange={handleInputChange}
                        className={errors.gender ? 'account_management_input_error' : ''}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      {errors.gender && <span className="account_management_error_message">{errors.gender}</span>}
                    </div>

                    <div className="account_management_form_group">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={account.address || ''}
                        onChange={handleInputChange}
                        className={errors.address ? 'account_management_input_error' : ''}
                      />
                      {errors.address && <span className="account_management_error_message">{errors.address}</span>}
                    </div>

                    <div className="account_management_form_group">
                      <label>Vai trò</label>
                      <input
                        type="text"
                        value={account.role || ''}
                        className="readonly-field"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="account_management_form_actions">
                  <button
                    className="update_button"
                    onClick={handleUpdateAllChanges}
                  >
                    <FaSave /> Cập nhật thông tin
                  </button>
                  <button
                    className="delete_account_button"
                    onClick={confirmDeleteAccount}
                  >
                    <FaTrash /> Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isDeleteConfirmOpen && (
            <motion.div
              className="account_management_delete_confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="account_management_delete_confirm_content">
                <div className="account_management_delete_confirm_icon">
                  <FaTrash />
                </div>
                <h3>Xác nhận xóa tài khoản</h3>
                <p>
                  Bạn có chắc chắn muốn xóa tài khoản này? <br />
                  <b>Hành động này không thể hoàn tác</b> và tất cả dữ liệu của bạn sẽ bị mất.
                </p>
                <div className="account_management_delete_confirm_actions">
                  <button className="account_management_button account_management_danger" onClick={handleDeleteAccount}>
                    <FaTrash /> Xóa tài khoản
                  </button>
                  <button className="account_management_button account_management_secondary" onClick={cancelDeleteAccount}>
                    <FaTimes /> Hủy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountManagement;