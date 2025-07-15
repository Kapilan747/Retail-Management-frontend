import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const dramaticRotate = {
  hidden: { opacity: 0, rotate: -20, scale: 0.9 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.8, type: 'spring', stiffness: 60, damping: 18 } }
};

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const user = localStorage.getItem('user');
    if (!isAdmin && !user) {
      navigate('/sign-in', { replace: true });
    }
  }, [navigate]);
  return (
    <motion.div
      variants={dramaticRotate}
      initial="hidden"
      animate="visible"
      className="notfound-root"
    >
      <div className="notfound-content">
        <div className="notfound-emoji">🚫</div>
        <h1 className="notfound-title">404 - Not Found</h1>
        <p className="notfound-desc">Sorry, the page you are looking for does not exist.</p>
        <button className="btn notfound-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </motion.div>
  );
}

export default NotFound; 