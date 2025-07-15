import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, addUser } from '../services/api';
import '../styles/main.css';
import './SignUp.css';
import { motion } from 'framer-motion';

const wrapperFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, when: 'beforeChildren', staggerChildren: 0.15 } }
};
const fieldSlideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
const buttonPop = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};
const errorBounce = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 8 } }
};

function SignUp({ onToast }) {
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password || !form.name) {
      setError('All fields required');
      onToast && onToast('All fields required', '#d32f2f');
      return;
    }
    try {
      const users = (await getUsers()).data;
      if (users.find(u => u.username === form.username)) {
        setError('Username already exists');
        onToast && onToast('Username already exists', '#d32f2f');
        return;
      }
      const newUser = { ...form, role: 'user' };
      const res = await addUser(newUser);
      let user = res.data;
      if (user && !user.id && user._id) user.id = user._id;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('isAdmin');
      navigate('/user-dashboard');
      onToast && onToast('Sign up successful', '#388e3c');
    } catch (err) {
      console.error(err);
      setError('Network error');
      onToast && onToast('Network error', '#d32f2f');
    }
  };

  return (
    <div className="signup-root">
      <motion.div
        variants={wrapperFade}
        initial="hidden"
        animate="visible"
        className="signup-card-wrapper"
      >
        <div className="signup-card">
          <motion.div variants={fieldSlideUp} className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join our platform today</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="signup-form"
            variants={wrapperFade} 
            initial="hidden" 
            animate="visible"
          >
            <motion.div variants={fieldSlideUp}>
              <input 
                name="name" 
                placeholder="Full Name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="signup-input"
                autoComplete="name" 
                aria-label="Full Name" 
              />
            </motion.div>

            <motion.div variants={fieldSlideUp}>
              <input 
                name="username" 
                placeholder="Username" 
                value={form.username} 
                onChange={handleChange} 
                required 
                className="signup-input"
                autoComplete="username" 
                aria-label="Username" 
              />
            </motion.div>

            <motion.div variants={fieldSlideUp}>
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                className="signup-input"
                autoComplete="new-password" 
                aria-label="Password" 
              />
            </motion.div>

            {error && (
              <motion.div 
                className="signup-error" 
                variants={errorBounce}
              >
                {error}
              </motion.div>
            )}

            <motion.button 
              className="btn signup-submit" 
              type="submit"
              variants={buttonPop}
            >
              Sign Up
            </motion.button>
          </motion.form>
          <motion.div variants={fieldSlideUp} className="signup-footer">
            <span>Already have an account? </span>
            <Link to="/sign-in" className="signup-link">Sign In</Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp; 