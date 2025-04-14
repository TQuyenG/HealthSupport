import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';
import Sidebar from '../../../common/components/sidebar/Sidebar';
import AccountManagement from '../account-management/AccountManagement';
import {
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaFileMedical,
  FaNewspaper,
  FaUserCircle,
  FaUserFriends,
  FaComments,
  FaChartBar,
  FaCreditCard,
  FaCog,
  FaCommentMedical,
  FaUser,
  FaBell as FaNotifications,
  FaEdit,
  FaSave,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import authApi from '../../api/authApi';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Dữ liệu giả lập cho thống kê nhanh
const mockVisitData = [
  { name: 'T2', visits: 34 },
  { name: 'T3', visits: 45 },
  { name: 'T4', visits: 38 },
  { name: 'T5', visits: 52 },
  { name: 'T6', visits: 48 },
  { name: 'T7', visits: 36 },
  { name: 'CN', visits: 30 },
];

const mockUserData = [
  { name: 'T2', users: 4 },
  { name: 'T3', users: 5 },
  { name: 'T4', users: 3 },
  { name: 'T5', users: 7 },
  { name: 'T6', users: 8 },
  { name: 'T7', users: 6 },
  { name: 'CN', users: 4 },
];

const mockActiveData = [
  { name: 'T2', active: 24 },
  { name: 'T3', active: 25 },
  { name: 'T4', active: 23 },
  { name: 'T5', active: 27 },
  { name: 'T6', active: 28 },
  { name: 'T7', active: 26 },
  { name: 'CN', active: 24 },
];

const DashboardFeatureCard = ({ title, icon: MainIcon, roleClass, onClick, index, module, isEditing }) => {
  return isEditing ? (
    <Draggable draggableId={module} index={index}>
      {(provided, snapshot) => (
        <div
          className={`dashboard_feature_card ${roleClass}_card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? provided.draggableProps.style.transform 
              : 'translate(0, 0)'
          }}
        >
          <div className="dashboard_feature_icon">{MainIcon && <MainIcon />}</div>
          <div className="dashboard_feature_title">
            <h3>{title}</h3>
            <span className={`dashboard_role_badge ${roleClass}`}>{roleClass}</span>
          </div>
        </div>
      )}
    </Draggable>
  ) : (
    <motion.div
      className={`dashboard_feature_card ${roleClass}_card`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      data-tooltip-id={`tooltip-${title.replace(/\s+/g, '-').toLowerCase()}`}
      data-tooltip-content={`Mở ${title.toLowerCase()}`}
    >
      <div className="dashboard_feature_icon">{MainIcon && <MainIcon />}</div>
      <div className="dashboard_feature_title">
        <h3>{title}</h3>
        <span className={`dashboard_role_badge ${roleClass}`}>{roleClass}</span>
      </div>
      <Tooltip id={`tooltip-${title.replace(/\s+/g, '-').toLowerCase()}`} />
    </motion.div>
  );
};

const StatWidget = ({ title, value, chartData, dataKey, color, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div className="stat_widget" onClick={handleClick}>
      <div className="stat_widget_header">
        <div className="stat_widget_title">{title}</div>
        <div className="stat_widget_value">{value}</div>
      </div>
      <div className="stat_widget_chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis hide={true} />
            <RechartsTooltip />
            <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#color${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const NotificationBadge = ({ count }) => {
  return count > 0 ? (
    <motion.div
      className="notification_badge"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 10 }}
    >
      {count}
    </motion.div>
  ) : null;
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [moduleOrder, setModuleOrder] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const widgetsRef = useRef(null);
  const mainContentRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcomeModal(true);
      setTimeout(() => setShowWelcomeModal(false), 3000);
    }, 500);

    if (user) {
      setIsLoading(true);
      authApi.getPermissionsByRole(user.role)
        .then(response => {
          console.log(`Quyền của ${user.role}:`, response.data);
          setUserPermissions(response.data);
          const savedOrder = localStorage.getItem(`moduleOrder_${user.id || user.email}`);
          const modules = [...new Set(response.data.map(perm => perm.module).filter(m => m && m !== 'general'))];
          if (savedOrder) {
            const parsedOrder = JSON.parse(savedOrder);
            const missingModules = modules.filter(m => !parsedOrder.includes(m));
            setModuleOrder([...parsedOrder.filter(m => modules.includes(m)), ...missingModules]);
          } else {
            setModuleOrder(modules);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Lỗi lấy dữ liệu quyền:', error);
          setIsLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!widgetsRef.current || !mainContentRef.current || !footerRef.current) return;

    const handleScroll = () => {
      const widgets = widgetsRef.current;
      const footer = footerRef.current;
      const mainContent = mainContentRef.current;

      if (!widgets || !footer || !mainContent) return;

      const mainContentRect = mainContent.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const widgetsHeight = widgets.offsetHeight;

      if (footerRect.top - mainContentRect.top < widgetsHeight) {
        const topPosition = footerRect.top - widgetsHeight - mainContentRect.top;
        widgets.style.position = 'absolute';
        widgets.style.top = `${topPosition}px`;
      } else if (mainContentRect.top <= 0) {
        widgets.style.position = 'fixed';
        widgets.style.top = '20px';
        widgets.style.width = widgets.parentElement.offsetWidth + 'px';
      } else {
        widgets.style.position = 'static';
        widgets.style.width = '100%';
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const toggleSidebar = collapsed => setSidebarCollapsed(collapsed);
  const onChange = date => setDate(date);

  const moduleConfig = {
    manage_accounts: { title: 'Quản lý tài khoản', icon: FaUserCircle, route: null },
    manage_permissions: { title: 'Quản lý chức năng', icon: FaCog, route: '/permissions' },
    manage_consultations: { title: 'Quản lý tư vấn', icon: FaCommentMedical, route: '/consultations' },
    manage_content: { title: 'Quản lý nội dung', icon: FaNewspaper, route: '/content' },
    manage_medical_info: { title: 'Quản lý thông tin y tế', icon: FaFileMedical, route: '/medical-info' },
    manage_profiles: { title: 'Quản lý hồ sơ cá nhân', icon: FaUser, route: '/profiles' },
    manage_notifications: { title: 'Quản lý thông báo', icon: FaNotifications, route: '/notifications' },
    manage_forum: { title: 'Quản lý diễn đàn', icon: FaComments, route: '/forum' },
    manage_groups: { title: 'Quản lý nhóm bệnh nhân', icon: FaUserFriends, route: '/groups' },
    manage_payments: { title: 'Quản lý thanh toán', icon: FaCreditCard, route: '/payments' },
    manage_analytics: { title: 'Thống kê và báo cáo', icon: FaChartBar, route: '/analytics' },
    manage_schedules: { title: 'Quản lý lịch khám', icon: FaCalendarAlt, route: '/schedules' },
    manage_users: { title: 'Quản lý người dùng', icon: FaUsers, route: '/user_management' },
  };

  const handleModuleSelect = (module) => {
    if (isEditing) return; // Không cho click khi đang chỉnh sửa
    const config = moduleConfig[module];
    if (module === 'manage_accounts') {
      setShowAccountPopup(true);
    } else if (config && config.route) {
      navigate(config.route);
    } else {
      console.warn(`Module ${module} chưa được định nghĩa route`);
    }
  };

  const handleAccountClose = () => {
    setShowAccountPopup(false);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Lưu thứ tự khi thoát chỉnh sửa
      localStorage.setItem(`moduleOrder_${user.id || user.email}`, JSON.stringify(moduleOrder));
      
      // Hiệu ứng lưu thành công
      // Bạn có thể thêm thông báo toast ở đây nếu có
    }
    
    // Animation khi chuyển chế độ
    const featuresGrid = document.querySelector('.dashboard_features_grid');
    if (featuresGrid) {
      featuresGrid.style.transition = 'all 0.3s ease';
      featuresGrid.style.transform = 'scale(0.98)';
      setTimeout(() => {
        featuresGrid.style.transform = 'scale(1)';
        setIsEditing(!isEditing);
      }, 200);
    } else {
      setIsEditing(!isEditing);
    }
  };

  const getUserModules = () => {
    const modules = [...new Set(userPermissions.map(perm => perm.module).filter(m => m && m !== 'general'))];
    const orderedModules = [];
    const unorderedModules = modules.filter(m => !moduleOrder.includes(m));

    moduleOrder.forEach(module => {
      if (modules.includes(module) && moduleConfig[module]) {
        orderedModules.push(module);
      }
    });

    return [...orderedModules, ...unorderedModules.filter(m => moduleConfig[m])];
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const modules = getUserModules();
    const newOrder = [...modules];
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    setModuleOrder(newOrder);
  };

  const renderFeatures = () => {
    const modules = getUserModules();
    if (!modules.length) return null;

    return (
      <motion.div
        className={`dashboard_features_section ${isEditing ? 'editing' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard_section_header">
          <h2 className="dashboard_section_title">Các chức năng</h2>
          <div
            className="dashboard_edit_icon"
            onClick={toggleEditMode}
            data-tooltip-id="edit-tooltip"
            data-tooltip-content={isEditing ? 'Lưu thứ tự' : 'Kéo thả thứ tự các chức năng'}
          >
            {isEditing ? <FaSave /> : <FaEdit />}
            <Tooltip id="edit-tooltip" />
          </div>
        </div>
        {isEditing ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="modules" direction="grid">
              {(provided, snapshot) => (
                <div
                  className="dashboard_features_grid"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {modules.map((module, index) => {
                    const config = moduleConfig[module];
                    if (!config) return null;
                    return (
                      <DashboardFeatureCard
                        key={module}
                        title={config.title}
                        icon={config.icon}
                        roleClass={user?.role}
                        onClick={() => {}}
                        index={index}
                        module={module}
                        isEditing={isEditing}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="dashboard_features_grid">
            {modules.map((module) => {
              const config = moduleConfig[module];
              if (!config) return null;
              return (
                <DashboardFeatureCard
                  key={module}
                  title={config.title}
                  icon={config.icon}
                  roleClass={user?.role}
                  onClick={() => handleModuleSelect(module)}
                  index={0}
                  module={module}
                  isEditing={isEditing}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    );
  };

  const renderSkeleton = () => (
    <div className="dashboard_skeleton">
      <div className="skeleton_header"></div>
      <div className="skeleton_section">
        <div className="skeleton_title"></div>
        <div className="skeleton_cards">
          <div className="skeleton_card"></div>
          <div className="skeleton_card"></div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="dashboard_auth_required">
        <motion.div
          className="dashboard_auth_card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Truy cập bị từ chối</h2>
          <p>Vui lòng đăng nhập để truy cập Dashboard!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="dashboard_auth_button">
              Đăng nhập
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`dashboard_layout ${sidebarCollapsed ? 'dashboard_sidebar_collapsed' : ''}`}>
      <Sidebar onToggle={toggleSidebar} />
      <div className={`dashboard_main ${sidebarCollapsed ? 'dashboard_sidebar_collapsed' : ''}`}>
        <div className="dashboard_header">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard
          </motion.h1>
          <motion.div
            className="dashboard_user_profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="dashboard_notifications"
              data-tooltip-id="notifications-tooltip"
              data-tooltip-content="Thông báo"
            >
              <FaBell />
              <NotificationBadge count={notifications} />
              <Tooltip id="notifications-tooltip" />
            </div>
            <div className="dashboard_user_info">
              <span className="dashboard_welcome_text">Xin chào,</span>
              <span className="dashboard_user_email">{user.username || user.email}</span>
              <span className="dashboard_user_role">
                Vai trò: <span className={`role_tag ${user.role}`}>{user.role}</span>
              </span>
            </div>
            <div className="dashboard_user_avatar" onClick={() => setShowAccountPopup(true)}>
              <img
                src={
                  user.avatar && user.avatar !== 'null'
                    ? `http://localhost:5000/avatars/${user.avatar}?t=${new Date().getTime()}`
                    : 'http://localhost:5000/avatars/d1.jpg'
                }
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error(`Lỗi tải ảnh avatar: http://localhost:5000/avatars/${user.avatar}`);
                  e.target.src = 'http://localhost:5000/avatars/d1.jpg';
                }}
              />
            </div>
          </motion.div>
        </div>

        <div className="dashboard_content" ref={mainContentRef}>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <div className="dashboard_main_content">
              <div className="dashboard_features_column">{renderFeatures()}</div>

              <motion.div
                className="dashboard_widgets_wrapper"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                ref={widgetsRef}
              >
                <div className="dashboard_widgets">
                  <div className="dashboard_calendar_widget">
                    <div className="dashboard_widget_header">
                      <h3>Lịch</h3>
                    </div>
                    <div className="dashboard_calendar_container">
                      <Calendar
                        onChange={onChange}
                        value={date}
                        className="dashboard_react_calendar"
                      />
                    </div>
                  </div>

                  <div className="dashboard_quick_stats_widget">
                    <div className="dashboard_widget_header">
                      <h3>Thống kê nhanh</h3>
                    </div>
                    <div className="quick_stats_container">
                      <StatWidget
                        title="Người dùng xem website"
                        value="854"
                        chartData={mockVisitData}
                        dataKey="visits"
                        color="#4f46e5"
                        to="/analytics"
                      />
                      <StatWidget
                        title="Người dùng đăng ký"
                        value="37"
                        chartData={mockUserData}
                        dataKey="users"
                        color="#f97316"
                        to="/analytics"
                      />
                      <StatWidget
                        title="Đang sử dụng website"
                        value="142"
                        chartData={mockActiveData}
                        dataKey="active"
                        color="#10b981"
                        to="/analytics"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAccountPopup && (
          <AccountManagement user={user} onClose={handleAccountClose} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            className="welcome_modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="welcome_modal_content">
              <div className="welcome_modal_header">
                <div className="welcome_icon pulse"></div>
              </div>
              <h3>Chào mừng trở lại, {user.username || user.email.split('@')[0]}!</h3>
              <p>Bạn có {notifications} thông báo mới</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;