import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../styles/main.css';
import './UserLogin.css';
import { motion } from 'framer-motion';

const fadeStagger = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.7 } }
};
const fadeItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

function UserLogin({ onToast }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = await loginUser(form.username, form.password);
      if (user && user.role === 'user') {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/user-dashboard');
        onToast && onToast('Login successful', '#388e3c');
      } else {
        setError('Invalid credentials or not a user');
        onToast && onToast('Invalid credentials', '#d32f2f');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
      onToast && onToast('Network error', '#d32f2f');
    }
  };

  return (
    <div className="userlogin-root">
      <motion.div
        variants={fadeStagger}
        initial="hidden"
        animate="visible"
        className="userlogin-card-wrapper"
      >
        <div className="userlogin-card">
          <motion.div variants={fadeItem} className="userlogin-header">
            <h1 className="userlogin-title">User Login</h1>
            <p className="userlogin-subtitle">Access your user dashboard</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="userlogin-form"
            variants={fadeStagger} 
            initial="hidden" 
            animate="visible"
          >
            <motion.div variants={fadeItem}>
              <input 
                name="username" 
                placeholder="Username" 
                value={form.username} 
                onChange={handleChange} 
                required 
                className="userlogin-input"
                autoComplete="username" 
                aria-label="Username" 
              />
            </motion.div>

            <motion.div variants={fadeItem}>
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                className="userlogin-input"
                autoComplete="current-password" 
                aria-label="Password" 
              />
            </motion.div>

            {error && (
              <motion.div 
                className="userlogin-error" 
                variants={fadeItem}
              >
                {error}
              </motion.div>
            )}

            <motion.button 
              className="btn userlogin-submit" 
              type="submit"
              variants={fadeItem}
            >
              Login
            </motion.button>
          </motion.form>

          <motion.div 
            style={{ 
              marginTop: 32, 
              padding: '20px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e0e3e7'
            }}
            variants={fadeItem}
          >
            <div style={{ 
              color: '#5f6368', 
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 16
            }}>
              <div style={{ fontWeight: 600, color: '#1a73e8', marginBottom: 8 }}>Demo Accounts</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>User 1:</span> user1 / user123
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>User 2:</span> user2 / user123
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserLogin; 