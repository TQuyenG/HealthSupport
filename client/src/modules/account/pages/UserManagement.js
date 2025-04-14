import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserManagementForm from '../components/user-management/UserManagement';

const UserManagement = () => {
    const { user } = useContext(AuthContext);
  
    if (!user) {
      return <div>Vui lòng đăng nhập để truy cập trang này.</div>;
    }
  
    return <UserManagementForm />;
  };

export default UserManagement;