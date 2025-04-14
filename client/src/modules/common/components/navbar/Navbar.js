import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaSearch, FaChevronDown, FaTachometerAlt, FaCalendarAlt, FaCog, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from '../../../account/context/AuthContext'; // Sửa từ default import thành named import
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useContext(AuthContext); // Sửa: Dùng 'user' thay vì 'isAuthenticated', thêm 'logout'
  const isAuthenticated = !!user; // Xác định trạng thái đăng nhập dựa trên 'user'

  // Example health menu items (this would come from your database/API)
  const healthMenuItems = [
    { title: "Dinh dưỡng lành mạnh", link: "/health/nutrition" },
    { title: "Tập luyện thể thao", link: "/health/exercise" },
    { title: "Sức khỏe tâm thần", link: "/health/mental-health" },
    { title: "Phòng ngừa bệnh tật", link: "/health/prevention" },
    { title: "Sức khỏe người cao tuổi", link: "/health/elderly" },
    { title: "Sức khỏe gia đình", link: "/health/family" },
    { title: "Sức khỏe trẻ em", link: "/health/children" },
    { title: "Sức khỏe phụ nữ", link: "/health/women" },
    { title: "Y học dự phòng", link: "/health/preventive-medicine" },
    { title: "Đông y", link: "/health/traditional-medicine" },
  ];

  // Example medicine menu items
  const medicineMenuItems = [
    { title: "Thuốc kê đơn", link: "/medicine/prescription" },
    { title: "Thuốc không kê đơn", link: "/medicine/otc" },
    { title: "Vitamin & thực phẩm chức năng", link: "/medicine/supplements" },
    { title: "Thuốc thảo dược", link: "/medicine/herbal" },
    { title: "Thuốc cảm & đau họng", link: "/medicine/cold-flu" },
    { title: "Thuốc da liễu", link: "/medicine/dermatology" },
    { title: "Thuốc tiêu hóa", link: "/medicine/digestive" },
    { title: "Thuốc huyết áp", link: "/medicine/blood-pressure" },
    { title: "Thuốc tim mạch", link: "/medicine/cardiovascular" },
    { title: "Thuốc giảm đau", link: "/medicine/pain-relief" },
  ];

  // Example doctor menu items
  const doctorMenuItems = [
    { title: "Bác sĩ nội khoa", link: "/doctor/internal-medicine" },
    { title: "Bác sĩ nhi khoa", link: "/doctor/pediatrics" },
    { title: "Bác sĩ gia đình", link: "/doctor/family-medicine" },
    { title: "Bác sĩ da liễu", link: "/doctor/dermatology" },
    { title: "Bác sĩ tim mạch", link: "/doctor/cardiology" },
    { title: "Bác sĩ sản phụ khoa", link: "/doctor/ob-gyn" },
    { title: "Bác sĩ thần kinh", link: "/doctor/neurology" },
    { title: "Bác sĩ cơ xương khớp", link: "/doctor/orthopedics" },
    { title: "Bác sĩ mắt", link: "/doctor/ophthalmology" },
    { title: "Bác sĩ tai mũi họng", link: "/doctor/ent" },
  ];

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown') && !event.target.closest('.account-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Split menu items into columns (max 5 items per column)
  const splitIntoColumns = (items) => {
    if (items.length <= 5) {
      return [items];
    }
    
    const firstColumn = items.slice(0, 5);
    const secondColumn = items.slice(5);
    return [firstColumn, secondColumn];
  };

  const healthColumns = splitIntoColumns(healthMenuItems);
  const medicineColumns = splitIntoColumns(medicineMenuItems);
  const doctorColumns = splitIntoColumns(doctorMenuItems);

  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/"><img src="/logo.png" alt="Logo" /></Link>
        </div>

        <ul className="navbar-menu">
          <li>
            <button 
              className={`nav-btn ${isActive('/') ? 'active' : ''}`} 
              onClick={() => window.location.href = '/'}
            >
              Trang chủ
            </button>
          </li>
          <li>
            <button 
              className={`nav-btn ${isActive('/about') ? 'active' : ''}`} 
              onClick={() => window.location.href = '/about'}
            >
              Giới thiệu
            </button>
          </li>

          {/* Chuyên mục Sức Khỏe */}
          <li className="dropdown">
            <span onClick={() => toggleDropdown("health")}>
              Chuyên mục Sức Khỏe <FaChevronDown />
            </span>
            <div className={`dropdown-menu ${activeDropdown === "health" ? "visible" : ""}`}>
              {healthColumns.map((column, colIndex) => (
                <div key={`health-col-${colIndex}`} className="dropdown-column">
                  {column.map((item, idx) => (
                    <Link key={`health-item-${idx}`} to={item.link}>{item.title}</Link>
                  ))}
                </div>
              ))}
            </div>
          </li>

          {/* Chuyên mục Thuốc */}
          <li className="dropdown">
            <span onClick={() => toggleDropdown("medicine")}>
              Chuyên mục Thuốc <FaChevronDown />
            </span>
            <div className={`dropdown-menu ${activeDropdown === "medicine" ? "visible" : ""}`}>
              {medicineColumns.map((column, colIndex) => (
                <div key={`medicine-col-${colIndex}`} className="dropdown-column">
                  {column.map((item, idx) => (
                    <Link key={`medicine-item-${idx}`} to={item.link}>{item.title}</Link>
                  ))}
                </div>
              ))}
            </div>
          </li>

          {/* Chuyên mục Bác sĩ */}
          <li className="dropdown">
            <span onClick={() => toggleDropdown("doctors")}>
              Chuyên mục Bác sĩ <FaChevronDown />
            </span>
            <div className={`dropdown-menu ${activeDropdown === "doctors" ? "visible" : ""}`}>
              {doctorColumns.map((column, colIndex) => (
                <div key={`doctor-col-${colIndex}`} className="dropdown-column">
                  {column.map((item, idx) => (
                    <Link key={`doctor-item-${idx}`} to={item.link}>{item.title}</Link>
                  ))}
                </div>
              ))}
            </div>
          </li>

          {/* Thanh tìm kiếm */}
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
            <FaSearch className="search-icon" />
          </div>
        </ul>

        <div className="navbar-right">
          {/* Dropdown Tài khoản - Hiển thị dựa trên trạng thái đăng nhập */}
          <div className="account-dropdown">
            <FaUserCircle size={24} onClick={() => toggleDropdown("account")} />
            <div className={`account-menu ${activeDropdown === "account" ? "visible" : ""}`}>
              {isAuthenticated ? (
                // Hiển thị khi đã đăng nhập
                <>
                  <Link to="/dashboard"><FaTachometerAlt className="icon" /> Dashboard</Link>
                  <Link to="/appointments"><FaCalendarAlt className="icon" /> Lịch hẹn</Link>
                  <Link to="/settings"><FaCog className="icon" /> Cài đặt</Link>
                  <Link to="/logout" onClick={logout}><FaSignOutAlt className="icon" /> Đăng xuất</Link>
                </>
              ) : (
                // Hiển thị khi chưa đăng nhập
                <>
                  <Link to="/dashboard"><FaTachometerAlt className="icon" /> Dashboard</Link>
                  <Link to="/appointments"><FaCalendarAlt className="icon" /> Lịch hẹn</Link>
                  <Link to="/settings"><FaCog className="icon" /> Cài đặt</Link>
                  <Link to="/login"><FaSignInAlt className="icon" /> Đăng nhập</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;