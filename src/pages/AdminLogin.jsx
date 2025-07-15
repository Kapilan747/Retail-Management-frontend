import React, { useState } from 'react';
import '../styles/main.css';
import './AdminLogin.css';
import { getUsers, updateUserActivity } from '../services/api';
import { motion } from 'framer-motion';

function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'admin123') {
      try {
        localStorage.setItem('isAdmin', 'true');
        const users = (await getUsers()).data;
        const adminUser = users.find(u => u.username === 'admin');
        
        if (adminUser) {
          await updateUserActivity(adminUser.id);
          const updatedAdminUser = { ...adminUser, lastActive: new Date().toISOString() };
          localStorage.setItem('user', JSON.stringify(updatedAdminUser));
        }
        
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Error during admin login:', err);
        setError('Login failed. Please try again.');
      }
    } else {
      setError('Invalid credentials. Try admin/admin123');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="adminlogin-root">
      <form className="card adminlogin-form" onSubmit={handleSubmit}>
        <h2 className="adminlogin-title">Admin Login</h2>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="adminlogin-input" autoFocus />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="adminlogin-input" />
        {error && <div className="adminlogin-error">{error}</div>}
        <button className="btn adminlogin-submit" type="submit">Login</button>
      </form>
    </motion.div>
  );
}

export default AdminLogin; 