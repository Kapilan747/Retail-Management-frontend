import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import '../styles/main.css';
import './Navbar.css';

function Navbar({ user, onLogout }) {
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

  return (
    <nav className="navbar-root">
      <div className="navbar-logo" onClick={() => navigate('/')}>RMSSS</div>
      <div className="navbar-links">

        <NavLink 
                 to="/" 
                 className={({ isActive }) => `navbar-link${isActive && location.pathname === '/' ? ' navbar-link-active' : ''}`}>

                 Homepage
        </NavLink>

        {!user && (
          <NavLink 
                to="/sign-in" 
                className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>

                Login
        </NavLink>
        )}

        {user && user.role === 'admin' && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Dashboard</NavLink>
            <NavLink to="/inventory" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Inventory</NavLink>
            <NavLink to="/customers" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Customers</NavLink>
            <NavLink to="/sales" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Sales</NavLink>
            <NavLink to="/admin-panel" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Admin Panel</NavLink>
          </>
        )}

        {user && user.role === 'user' && (
          <>
            <NavLink to="/user-dashboard" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Dashboard</NavLink>
            <NavLink to="/marketplace" className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}>Marketplace</NavLink>
          </>
        )}

        {user && (
          <div ref={dropdownRef} className="navbar-profile-dropdown-root">
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
        )}
      </div>
    </nav>
  );
}

export default Navbar; 