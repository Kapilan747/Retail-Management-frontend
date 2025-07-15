import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';
import './Header.css';

function Header({ onLogout }) {
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const navigate = useNavigate();
  return (
    <header className="header header-root">
      <div className="header-logo">RMSSS</div>
      <div className="header-actions">
        <span className="header-admin-name" onClick={() => navigate('/profile')}>
          {adminName}
        </span>
        <button className="btn header-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header; 