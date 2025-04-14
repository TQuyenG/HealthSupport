import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../account/context/AuthContext';
import authApi from '../../../account/api/authApi';
import AccountManagement from '../../../account/components/account-management/AccountManagement';
import { AnimatePresence } from 'framer-motion';
import './Sidebar.css';

// Font Awesome icons
import { 
  FaThLarge, FaUser, FaBell, FaHeart, // Chung 
  FaUsers, FaCalendarAlt, FaChartLine, // Cụ thể (ví dụ: Dashboard)
  FaCog, FaInfoCircle, FaPhone, FaQuestionCircle, FaExclamationTriangle, // Cài đặt
  FaUserCircle // Account Management
} from 'react-icons/fa';

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [userPermissions, setUserPermissions] = useState([]);
  const [allRolePermissions, setAllRolePermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  
  // Lấy trạng thái thu gọn từ localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setCollapsed(parsedState);
      if (onToggle) onToggle(parsedState);
    }
  }, [onToggle]);

  // Bộ đếm thời gian cho đồng hồ
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Xử lý cuộn cho sidebar khi có footer
  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.querySelector('.sidebar');
      const footer = document.querySelector('footer'); // hoặc selector cho footer của bạn
      
      if (sidebar && footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        
        if (footerTop < viewportHeight) {
          // Khi footer xuất hiện trong viewport
          const overlap = viewportHeight - footerTop;
          sidebar.style.transform = `translateY(-${overlap}px)`;
        } else {
          sidebar.style.transform = 'translateY(0)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lấy dữ liệu quyền từ API
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        authApi.getPermissionsByRole(user.role),
        authApi.getAllRolePermissions()
      ])
        .then(([userPermsResponse, allPermsResponse]) => {
          setUserPermissions(userPermsResponse.data || []);
          setAllRolePermissions(allPermsResponse.data || {});
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Lỗi khi lấy quyền:', error);
          setIsLoading(false);
        });
    }
  }, [user]);

  // Mở rộng/thu gọn sidebar
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) onToggle(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  // Xử lý khi nhấn vào menu
  const handleMenuItemClick = (path) => {
    if (path === '/account_management') {
      setShowAccountPopup(true);
    } else {
      navigate(path);
    }
  };

  // Định dạng thời gian hiển thị
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return { hours, minutes, seconds };
  };

  // Lấy quyền chung cho tất cả các vai trò
  const getCommonPermissions = () => {
    if (!Object.keys(allRolePermissions).length || !allRolePermissions.admin) return [];
    const roles = Object.keys(allRolePermissions);
    const allPerms = new Set();
    roles.forEach(role => {
      if (allRolePermissions[role]) allRolePermissions[role].forEach(p => allPerms.add(p.name));
    });
    const commonPerms = Array.from(allPerms).filter(perm =>
      roles.every(role => allRolePermissions[role]?.some(p => p.name === perm))
    );
    return commonPerms;
  };

  // Lấy module chung
  const getCommonModules = () => {
    const commonPerms = getCommonPermissions();
    return [...new Set(commonPerms
      .map(p => userPermissions.find(up => up.name === p)?.module)
      .filter(m => m))];
  };

  // Lấy module riêng cho vai trò hiện tại
  const getRoleSpecificModules = () => {
    if (!user || !user.role) return [];
    const commonPerms = getCommonPermissions();
    const roleSpecificPerms = userPermissions.filter(p => !commonPerms.includes(p.name));
    
    // Loại bỏ các module đã có trong menu chung
    const commonModuleNames = [...commonMenuItems.map(item => {
      // Tìm module tương ứng từ menu chung
      if (item.path === '/account_management') return 'account_management';
      if (item.path === '/notifications') return 'manage_notifications';
      if (item.path === '/favorites') return 'favorites';
      return null;
    }).filter(Boolean)];
    
    return [...new Set(roleSpecificPerms
      .map(p => p.module)
      .filter(module => module && !commonModuleNames.includes(module)))];
  };

  // Định nghĩa các module
  const modules = {
    'manage_users': { title: 'Quản lý người dùng', icon: FaUsers, path: '/user_management' },
    'manage_appointments': { title: 'Quản lý lịch hẹn', icon: FaCalendarAlt, path: '/appointments' },
    'analytics': { title: 'Thống kê', icon: FaChartLine, path: '/analytics' },
    'account_management': { title: 'Quản lý tài khoản', icon: FaUserCircle, path: '/account_management' },
    'manage_consultations': { title: 'Quản lý tư vấn', icon: FaQuestionCircle, path: '/consultations' },
    'manage_content': { title: 'Quản lý nội dung', icon: FaInfoCircle, path: '/content' },
    'manage_medical_info': { title: 'Quản lý thông tin y tế', icon: FaHeart, path: '/medical-info' },
    'manage_notifications': { title: 'Quản lý thông báo', icon: FaBell, path: '/notifications' },
    'manage_forum': { title: 'Quản lý diễn đàn', icon: FaBell, path: '/forum' },
    // Thêm các module khác khi cần
  };

  // Menu chung
  const commonMenuItems = [
    { path: '/dashboard', title: 'Dashboard', icon: <FaThLarge /> },
    { path: '/account_management', title: 'Tài khoản', icon: <FaUser /> },
    { path: '/notifications', title: 'Thông báo', icon: <FaBell /> },
    { path: '/favorites', title: 'Mục yêu thích', icon: <FaHeart /> },
  ];

  // Menu cài đặt
  const settingsMenuItems = [
    { path: '/settings', title: 'Cài đặt', icon: <FaCog /> },
    { path: '/about', title: 'Giới thiệu', icon: <FaInfoCircle /> },
    { path: '/contact', title: 'Liên hệ', icon: <FaPhone /> },
    { path: '/help', title: 'Trợ giúp', icon: <FaQuestionCircle /> },
    { path: '/report', title: 'Báo cáo', icon: <FaExclamationTriangle /> },
  ];

  // Render các mục menu
  const renderMenuItems = (items) =>
    items.map((item, index) => (
      <li
        key={item.path}
        className={`sidebar_item ${location.pathname === item.path ? 'sidebar_item_active' : ''}`}
        onClick={() => handleMenuItemClick(item.path)}
        data-title={item.title}
        style={{ '--item-index': index }}
      >
        <div className="sidebar_item_content">
          <span className="sidebar_icon">{item.icon}</span>
          <span className="sidebar_title">{item.title}</span>
        </div>
      </li>
    ));

  // Render Menu chung
  const renderCommonMenu = () => {
    const commonModules = getCommonModules();
    const commonItems = commonModules
      .map(module => modules[module])
      .filter(Boolean)
      .map(item => ({
        path: item.path,
        title: item.title,
        icon: <item.icon />
      }));
    
    return renderMenuItems([...commonMenuItems, ...commonItems]);
  };

  // Render Menu theo vai trò
  const renderRoleSpecificMenu = () => {
    if (!user || !user.role) return null;
    const roleModules = getRoleSpecificModules();
    if (!roleModules.length) return null;
    
    const roleItems = roleModules
      .map(module => modules[module])
      .filter(Boolean)
      .map(item => ({
        path: item.path,
        title: item.title,
        icon: <item.icon />
      }));
    
    return renderMenuItems(roleItems);
  };

  // Định dạng thời gian
  const { hours, minutes, seconds } = formatTime(currentTime);

  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Header với đồng hồ số */}
      <div className="sidebar_header" onClick={toggleSidebar}>
        <div className="digital_clock">
          <div className="clock_time">
            <span>{hours}</span>
            <span className="time_separator">:</span>
            <span>{minutes}</span>
            <span className="time_separator seconds">:</span>
            <span className="seconds">{seconds}</span>
          </div>
        </div>
      </div>

      <div className="sidebar_content">
        {/* Phần menu chung */}
        <div className="sidebar_section">
          <h4 className="sidebar_section_title">Chung</h4>
          <ul className="sidebar_menu">{!isLoading && renderCommonMenu()}</ul>
        </div>

        {/* Phần menu theo vai trò */}
        {!isLoading && getRoleSpecificModules().length > 0 && (
          <>
            <hr className="sidebar_divider" />
            <div className="sidebar_section">
              <h4 className="sidebar_section_title">{user?.role}</h4>
              <ul className="sidebar_menu">{renderRoleSpecificMenu()}</ul>
            </div>
          </>
        )}

        {/* Phần cài đặt */}
        <hr className="sidebar_divider" />
        <div className="sidebar_section sidebar_settings">
          <h4 className="sidebar_section_title">Cài đặt</h4>
          <ul className="sidebar_menu">{renderMenuItems(settingsMenuItems)}</ul>
          <div className="sidebar_footer">
            <p>Healthcare Support © 2025</p>
          </div>
        </div>
      </div>
      
      {/* Popup quản lý tài khoản */}
      <AnimatePresence>
        {showAccountPopup && (
          <AccountManagement 
            user={user} 
            onClose={() => setShowAccountPopup(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;