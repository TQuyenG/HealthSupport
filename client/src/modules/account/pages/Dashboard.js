import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/Dashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Vui lòng đăng nhập để truy cập Dashboard.</div>;
  }

  return <DashboardLayout />;
};

export default Dashboard;