import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;