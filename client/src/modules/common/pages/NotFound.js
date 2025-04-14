import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not_found_container">
      <div className="not_found_content">
        <div className="not_found_text">
          <h1 className="not_found_title">404</h1>
          <h2 className="not_found_subtitle">Không tìm thấy trang</h2>
          <p className="not_found_description">
            Trang bạn tìm không tồn tại.
          </p>
          <Link to="/" className="not_found_button">
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;