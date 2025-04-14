import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaSortAmountDown, 
  FaSortAmountUp, FaSortAlphaDown, FaSortAlphaUp, FaRedo, FaTimes, FaSort } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authApi from '../../api/authApi';
import Sidebar from '../../../common/components/sidebar/Sidebar';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [editUser, setEditUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOption, setSortOption] = useState('id_asc');
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const toggleSidebar = (collapsed) => setSidebarCollapsed(collapsed);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, filterRole, filterStatus, sortOption]);

  const loadUsers = async () => {
    try {
      const response = await authApi.getUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách người dùng:', error);
      toast.error('Không thể tải danh sách người dùng!', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const filterAndSortUsers = () => {
    let result = [...users];
    
    // Filter
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }
    if (filterStatus !== 'all') {
      result = result.filter(user => user.status === filterStatus);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        (user.username?.toLowerCase().includes(term) ||
         user.email.toLowerCase().includes(term) ||
         user.id.toString().includes(term))
      );
    }
    
    // Sort
    switch (sortOption) {
      case 'id_asc':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'id_desc':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'name_asc':
        result.sort((a, b) => a.username?.localeCompare(b.username || ''));
        break;
      case 'name_desc':
        result.sort((a, b) => b.username?.localeCompare(a.username || ''));
        break;
      case 'email_asc':
        result.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'email_desc':
        result.sort((a, b) => b.email.localeCompare(a.email));
        break;
      default:
        break;
    }
    
    setFilteredUsers(result);
  };

  const translateRole = (role) => {
    const roleMap = { admin: 'Quản trị viên', staff: 'Nhân viên', doctor: 'Bác sĩ', patient: 'Bệnh nhân' };
    return roleMap[role] || role;
  };

  const translateStatus = (status) => {
    const statusMap = { active: 'Kích hoạt', inactive: 'Chưa kích hoạt' };
    return statusMap[status] || status;
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterRoleChange = (e) => setFilterRole(e.target.value);
  const handleFilterStatusChange = (e) => setFilterStatus(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
    setSortOption('id_asc');
  };

  const handleAddUserClick = () => {
    setNewUser({ username: '', email: '', password: '', role: 'patient' });
    setErrors({});
    setIsAddingUser(true);
    setIsEditingUser(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsAddingUser(false);
    setIsEditingUser(false);
    setModalOpen(false);
    setErrors({});
  };

  const validateForm = (data, isEditing = false) => {
    const newErrors = {};
    
    if (!data.username || data.username.trim() === '') {
      newErrors.username = 'Tên người dùng là bắt buộc';
    }
    
    if (!data.email || data.email.trim() === '') {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!isEditing && (!data.password || data.password.trim() === '')) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (!isEditing && data.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user types
    setErrors({
      ...errors,
      [name]: undefined
    });
    
    if (isEditingUser) {
      setEditUser({ ...editUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newUser)) return;
    
    try {
      await authApi.addUser({ ...newUser, status: 'inactive' });
      toast.success('Người dùng đã được thêm thành công!', {
        position: "bottom-right",
        autoClose: 3000
      });
      closeModal();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm người dùng!', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const handleEditUserClick = (user) => {
    setEditUser(user);
    setErrors({});
    setIsEditingUser(true);
    setIsAddingUser(false);
    setModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editUser, true)) return;
    
    try {
      await authApi.updateUser(editUser.id, editUser);
      toast.success('Người dùng đã được cập nhật thành công!', {
        position: "bottom-right",
        autoClose: 3000
      });
      closeModal();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật người dùng!', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${username || userId}?`)) {
      try {
        await authApi.deleteUser(userId);
        toast.success('Người dùng đã được xóa thành công!', {
          position: "bottom-right",
          autoClose: 3000
        });
        loadUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể xóa người dùng!', {
          position: "bottom-right",
          autoClose: 3000
        });
      }
    }
  };

  return (
    <div className={`user_management_layout ${sidebarCollapsed ? 'user_management_sidebar_collapsed' : ''}`}>
      <Sidebar onToggle={toggleSidebar} />
      <div className={`user_management_main ${sidebarCollapsed ? 'user_management_sidebar_collapsed' : ''}`}>
        <ToastContainer />
        <div className="user_management_header">
            <h2>Quản lý người dùng</h2>
            <div className="user_management_actions">
            <button 
                className="user_management_button user_management_primary" 
                onClick={handleAddUserClick}
            >
                <FaUserPlus /> Thêm người dùng
            </button>
            </div>
        </div>
        
        <div className="user_management_search_bar">
            <div className="user_management_search_input">
            <FaSearch className="user_management_search_icon" />
            <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc ID..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            </div>
            
            <div className="user_management_filter">
            <FaSort className="user_management_filter_icon" />
            <select value={sortOption} onChange={handleSortChange}>
                <option value="id_asc">ID (thấp đến cao)</option>
                <option value="id_desc">ID (cao đến thấp)</option>
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
                <option value="email_asc">Email (A-Z)</option>
                <option value="email_desc">Email (Z-A)</option>
            </select>
            </div>
            
            <div className="user_management_filter">
            <FaFilter className="user_management_filter_icon" />
            <select value={filterRole} onChange={handleFilterRoleChange}>
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="staff">Nhân viên</option>
                <option value="doctor">Bác sĩ</option>
                <option value="patient">Bệnh nhân</option>
            </select>
            </div>
            
            <div className="user_management_filter">
            <FaFilter className="user_management_filter_icon" />
            <select value={filterStatus} onChange={handleFilterStatusChange}>
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Kích hoạt</option>
                <option value="inactive">Chưa kích hoạt</option>
            </select>
            </div>
            
            <button 
            className="user_management_button user_management_secondary user_management_reset_button" 
            onClick={resetFilters}
            >
            <FaRedo /> Đặt lại
            </button>
        </div>

        {modalOpen && (
            <div className="user_management_modal_overlay" onClick={closeModal}>
            <div className="user_management_modal" onClick={(e) => e.stopPropagation()}>
                <div className="user_management_modal_header">
                <h3>{isEditingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</h3>
                <button className="user_management_modal_close" onClick={closeModal}>
                    <FaTimes />
                </button>
                </div>
                
                <form onSubmit={isEditingUser ? handleUpdateUser : handleAddUser}>
                <div className="user_management_form_group">
                    <label htmlFor="username">Tên người dùng</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    value={isEditingUser ? editUser.username : newUser.username}
                    onChange={handleInputChange}
                    className={errors.username ? 'user_management_input_error' : ''}
                    />
                    {errors.username && <span className="user_management_error_message">{errors.username}</span>}
                </div>
                
                <div className="user_management_form_group">
                    <label htmlFor="email">Email</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={isEditingUser ? editUser.email : newUser.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'user_management_input_error' : ''}
                    />
                    {errors.email && <span className="user_management_error_message">{errors.email}</span>}
                </div>
                
                {!isEditingUser && (
                    <div className="user_management_form_group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className={errors.password ? 'user_management_input_error' : ''}
                    />
                    {errors.password && <span className="user_management_error_message">{errors.password}</span>}
                    </div>
                )}
                
                <div className="user_management_form_group">
                    <label htmlFor="role">Vai trò</label>
                    <select
                    id="role"
                    name="role"
                    value={isEditingUser ? editUser.role : newUser.role}
                    onChange={handleInputChange}
                    >
                    <option value="patient">Bệnh nhân</option>
                    <option value="doctor">Bác sĩ</option>
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                    </select>
                </div>
                
                {isEditingUser && (
                    <div className="user_management_form_group">
                    <label htmlFor="status">Trạng thái</label>
                    <select
                        id="status"
                        name="status"
                        value={editUser.status}
                        onChange={handleInputChange}
                    >
                        <option value="active">Kích hoạt</option>
                        <option value="inactive">Chưa kích hoạt</option>
                    </select>
                    </div>
                )}
                
                <div className="user_management_form_actions">
                    <button type="submit" className="user_management_button user_management_primary">
                    {isEditingUser ? 'Cập nhật' : 'Lưu'}
                    </button>
                    <button
                    type="button"
                    className="user_management_button user_management_secondary"
                    onClick={closeModal}
                    >
                    Hủy
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        <div className="user_management_table_container">
            <table className="user_management_table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                    <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>
                        <span className={`user_management_role_badge ${user.role}`}>
                        {translateRole(user.role)}
                        </span>
                    </td>
                    <td>
                        <span className={`user_management_status_badge ${user.status}`}>
                        {translateStatus(user.status)}
                        </span>
                    </td>
                    <td className="user_management_actions_cell">
                        <button
                        className="user_management_action_button user_management_edit"
                        onClick={() => handleEditUserClick(user)}
                        aria-label="Sửa"
                        >
                        <FaEdit />
                        </button>
                        <button
                        className="user_management_action_button user_management_delete"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        aria-label="Xóa"
                        >
                        <FaTrash />
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="6" className="user_management_no_data">
                    {searchTerm || filterRole !== 'all' || filterStatus !== 'all' ? 'Không tìm thấy người dùng phù hợp' : 'Chưa có người dùng nào'}
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  );
};

export default UserManagement;