import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../styles/main.css';
import './SignIn.css';
import { motion } from 'framer-motion';

const fadeStagger = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.7 } }
};
const fadeItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

function SignIn({ onToast, onLoginSuccess }) {
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
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(); // Notify App.js

        if (user.role === 'admin') {
          navigate('/dashboard');
          onToast && onToast('Admin login successful', '#388e3c');
        } else {
          navigate('/user-dashboard');
          onToast && onToast('Login successful', '#388e3c');
        }
      } else {
        setError('Invalid credentials');
        onToast && onToast('Invalid credentials', '#d32f2f');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
      onToast && onToast('Network error', '#d32f2f');
    }
  };

  return (
    <div className="signin-root">
      <motion.div
        variants={fadeStagger}
        initial="hidden"
        animate="visible"
        className="signin-card-wrapper"
      >
        <div className="signin-card">
          <motion.div variants={fadeItem} className="signin-header">
            <h1 className="signin-title">Welcome Back</h1>
            <p className="signin-subtitle">Sign in to your account</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="signin-form"
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
                className="signin-input"
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
                className="signin-input"
                autoComplete="current-password" 
                aria-label="Password" 
              />
            </motion.div>

            {error && (
              <motion.div 
                className="signin-error" 
                variants={fadeItem}
              >
                {error}
              </motion.div>
            )}

            <motion.button 
              className="btn signin-submit" 
              type="submit"
              variants={fadeItem}
            >
              Sign In
            </motion.button>
          </motion.form>
          <motion.div variants={fadeItem} className="signin-footer">
            <span>Don't have an account? </span>
            <Link to="/sign-up" className="signin-link">Sign Up</Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn; 