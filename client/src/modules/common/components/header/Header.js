import React, { useState, useEffect, useContext } from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '../../../account/context/AuthContext'; // Import AuthContext
import Navbar from '../../components/navbar/Navbar';
import './Header.css';

const Header = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin user từ AuthContext
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Xác định message dựa trên trạng thái đăng nhập
    let message = user
      ? `Chào mừng quay lại, ${user.email}!` // Nếu đã đăng nhập, dùng email từ user
      : "Xin chào! Chúc một ngày tốt lành!"; // Nếu chưa đăng nhập

    if (isTyping) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < message.length) {
          setTypingText(message.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
            setTypingText(message);
          }, 1000);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [user, isTyping]);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>Hotline: 1800-888-808</span>
          </div>
          <div className="divider"></div>
          <div className="contact-item">
            <FaEnvelope className="icon" />
            <a href="mailto:contact@healthsupport.com">contact@healthsupport.com</a>
          </div>
        </div>

        <div className="header-right">
          <span className={isTyping ? 'typing-animation' : ''}>
            {typingText}
          </span>
        </div>
      </header>
      <Navbar />
    </>
  );
};

export default Header;