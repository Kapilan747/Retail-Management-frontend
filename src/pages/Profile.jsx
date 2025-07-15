import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Profile.css';

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, when: 'beforeChildren', staggerChildren: 0.12 } }
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } }
};
const popIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

function Profile({ onToast }) {
  const [name, setName] = useState('Admin');

  useEffect(() => {
    const stored = localStorage.getItem('adminName');
    if (stored) setName(stored);
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      onToast && onToast('Name cannot be empty', '#d32f2f');
      return;
    }
    localStorage.setItem('adminName', name);
    onToast && onToast('Profile updated', '#388e3c');
  };

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      animate="visible"
      className="profile-root"
    >
      <motion.div className="card profile-card" variants={fadeIn} initial="hidden" animate="visible">
        <div className="profile-avatar">
          {name[0]}
        </div>
        <h2 className="profile-title">Profile</h2>
        <motion.form className="flex profile-form" variants={scaleUp} initial="hidden" animate="visible">
          <motion.input value={name} onChange={e => setName(e.target.value)} className="profile-input" autoComplete="name" aria-label="Full Name" variants={popIn} />
          <motion.button className="btn profile-save-btn" onClick={handleSave} variants={popIn}>Save</motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default Profile; 