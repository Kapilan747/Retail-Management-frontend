import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import '../styles/main.css';
import './Navbar.css';

function Navbar({ onLogout }) {
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isUser = user && user.role === 'user';
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
  }, []);

  return (
    <nav className="navbar-root">
      <div className="navbar-logo" onClick={() => navigate('/')}>RMSSS</div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `navbar-link${isActive && location.pathname === '/' ? ' navbar-link-active' : ''}`}>Homepage</NavLink>
        {isUser && <NavLink to="/user-dashboard" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Dashboard</NavLink>}
        {isUser && <NavLink to="/marketplace" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Marketplace</NavLink>}
        {!isUser && <NavLink to="/dashboard" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Dashboard</NavLink>}
        {!isUser && <NavLink to="/inventory" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Inventory</NavLink>}
        {!isUser && <NavLink to="/customers" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Customers</NavLink>}
        {!isUser && <NavLink to="/sales" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Sales</NavLink>}
        {!isUser && <NavLink to="/admin-panel" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Admin Panel</NavLink>}
        <div
          ref={dropdownRef}
          className="navbar-profile-dropdown-root"
        >
          <span
            className={`navbar-profile-btn${dropdownOpen ? ' open' : ''}`}
            onClick={() => setDropdownOpen(v => !v)}
          >
            Profile
          </span>
          {dropdownOpen && (
            <div className={`navbar-dropdown${dropdownOpen ? ' navbar-dropdown-anim' : ''}`}>
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 