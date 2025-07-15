import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/main.css';
import './UserSidebar.css';

const navItems = [
  { to: '/', label: 'Homepage' },
  { to: '/user-dashboard', label: 'Dashboard' },
  { to: '/marketplace', label: 'Marketplace' }
];

function UserSidebar({ onLogout, style }) {
  const navigate = useNavigate();
  return (
    <aside className="sidebar user-sidebar-root">
      <nav className="user-sidebar-nav">
        <div className="user-sidebar-links">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive ? 'navbar-link-active' : 'navbar-link'}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <button className="btn user-sidebar-logout" onClick={onLogout}>Logout</button>
      </nav>
    </aside>
  );
}

export default UserSidebar; 