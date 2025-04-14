// healthcare-support-project/client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/account/context/AuthContext';
import Layout from './modules/common/components/layout/Layout'; 
import Home from './modules/common/pages/Home';
import About from './modules/common/pages/About';
import Login from './modules/account/pages/Login';
import Register from './modules/account/pages/Register';
import VerifyOtp from './modules/account/pages/VerifyOtp'; 
import ForgotPassword from './modules/account/pages/ForgotPassword';
import ResetPassword from './modules/account/pages/ResetPassword';
import Dashboard from './modules/account/pages/Dashboard';
import UserManagement from './modules/account/pages/UserManagement';
import NotFound from './modules/common/pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Tất cả routes sẽ dùng Layout chung */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user_management" element={<UserManagement />} />
            {/* Chuyển hướng mặc định nếu truy cập đường dẫn không xác định */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;