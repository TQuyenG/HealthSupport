import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Tin tức mới nhất */}
        <div className="footer-section news-section">
          <h3>Tin tức mới nhất</h3>
          <ul className="news-list">
            <li className="news-item">
              <img src="/images/news1.jpg" alt="Tin tức" className="news-thumbnail" />
              <div className="news-content">
                <h4 className="news-title">Phát hiện phương pháp mới điều trị tiểu đường</h4>
                <span className="news-date">05/04/2025</span>
              </div>
            </li>
            <li className="news-item">
              <img src="/images/news2.jpg" alt="Tin tức" className="news-thumbnail" />
              <div className="news-content">
                <h4 className="news-title">Bộ Y tế khuyến cáo phòng chống dịch sốt xuất huyết</h4>
                <span className="news-date">03/04/2025</span>
              </div>
            </li>
            <li className="news-item">
              <img src="/images/news3.jpg" alt="Tin tức" className="news-thumbnail" />
              <div className="news-content">
                <h4 className="news-title">Chế độ dinh dưỡng cho người cao tuổi trong mùa hè</h4>
                <span className="news-date">01/04/2025</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Chuyên mục */}
        <div className="footer-section category-section">
          <h3>Chuyên mục</h3>
          <ul className="category-list">
            <li><Link to="/benh-theo-mua">Bệnh theo mùa</Link></li>
            <li><Link to="/suc-khoe-gia-dinh">Sức khỏe gia đình</Link></li>
            <li><Link to="/dinh-duong">Dinh dưỡng</Link></li>
            <li><Link to="/me-va-be">Mẹ và bé</Link></li>
            <li><Link to="/tam-ly">Tâm lý</Link></li>
          </ul>
        </div>

        {/* Dịch vụ */}
        <div className="footer-section service-section">
          <h3>Dịch vụ</h3>
          <ul className="category-list">
            <li><Link to="/tu-van-truc-tuyen">Tư vấn trực tuyến</Link></li>
            <li><Link to="/dat-lich-kham">Đặt lịch khám</Link></li>
            <li><Link to="/tim-bac-si">Tìm bác sĩ</Link></li>
            <li><Link to="/co-so-y-te">Cơ sở y tế</Link></li>
            <li><Link to="/thuoc">Tra cứu thuốc</Link></li>
          </ul>
        </div>

        {/* Follow & Giới thiệu */}
        <div className="footer-features">
          <div className="features-row">

            {/* Theo dõi */}
            <div className="feature-column">
              <h3>Theo dõi chúng tôi</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook-icon">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram-icon">
                  <FaInstagram />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon x-icon">
                  <FaXTwitter />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube-icon">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Giới thiệu */}
            <div className="feature-column">
              <h3>Giới thiệu</h3>
              <p className="intro-text">Website cung cấp thông tin y tế, tư vấn sức khỏe uy tín.</p>
              <Link to="/about" className="view-more-btn">Xem thêm</Link>
            </div>
          </div>

          {/* Đăng ký nhận tin */}
          <div className="subscribe-box">
            <h3>Đăng ký nhận tin</h3>
            <form className="subscribe-form">
              <input 
                type="email" 
                placeholder="Nhập địa chỉ email của bạn" 
                className="subscribe-input" 
                required 
              />
              <button type="submit" className="subscribe-button">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-container-bottom">
          <p>© {currentYear} Health Support. Tất cả quyền được bảo lưu.</p>
          <div className="footer-links">
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            <Link to="/bao-mat">Chính sách bảo mật</Link>
            <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Go Up
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
