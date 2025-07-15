import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/main.css';
import './Sidebar.css';

const navItems = [
  { to: '/', label: 'Homepage' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/customers', label: 'Customers' },
  { to: '/sales', label: 'Sales' },
  { to: '/admin-panel', label: 'Admin Panel' }
];

function Sidebar({ style }) {
  return (
    <aside className="sidebar sidebar-root">
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'navbar-link-active' : 'navbar-link'}
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar; 