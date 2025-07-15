import React, { useState } from 'react';
import AddCustomer from '../components/AddCustomer';
import CustomerList from '../components/CustomerList';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import './Customers.css';

const flipVariants = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { opacity: 1, rotateY: 0, transition: { type: 'spring', stiffness: 60, damping: 18, when: 'beforeChildren', staggerChildren: 0.15 } }
};
const bounceIn = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } }
};

function Customers({ onToast }) {
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const newThisMonth = 3;
  const handleDone = () => {
    setEditing(null);
    setRefresh(r => !r);
  };
  return (
    <motion.div
      variants={flipVariants}
      initial="hidden"
      animate="visible"
      className="customers-root"
    >
      <div className="customers-header-row">
        <FaUsers size={36} color="var(--primary)" />
        <div>
          <h1 className="customers-title">Customer Directory</h1>
          <div className="customers-subtitle">Manage your customer relationships and growth</div>
        </div>
        <div className="customers-new-month">New This Month: {newThisMonth}</div>
      </div>
      <motion.div layoutId="dashboard-customers-card" variants={bounceIn} initial="hidden" animate="visible" className="customers-add-row">
      </motion.div>
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="customers-list-row">
        <div className="card customers-list-card">
          <CustomerList key={refresh} onEdit={setEditing} onToast={onToast} />
        </div>
      </motion.div>
      <div className="customers-quote">
        "The best CRM experience we've had! Our customers are happier than ever."<br />
        <span className="customers-quote-author">— RetailPro Client</span>
      </div>
    </motion.div>
  );
}

export default Customers; 