import React, { useState } from 'react';
import AddSale from '../components/AddSale';
import SaleList from '../components/SaleList';
import { motion } from 'framer-motion';
import { FaReceipt } from 'react-icons/fa';
import './Sales.css';

const wrapperSlideUp = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, when: 'beforeChildren', staggerChildren: 0.15 } }
};

function Sales({ onToast }) {
  const [refresh, setRefresh] = useState(false);
  const todaysSales = 7;
  const handleDone = () => setRefresh(r => !r);
  return (
    <motion.div
      variants={wrapperSlideUp}
      initial="hidden"
      animate="visible"
      className="sales-root"
    >
      <div className="sales-single-card card">
        <header className="sales-header">
          <FaReceipt size={38} className="sales-header-icon" />
          <span className="sales-header-title">Sales & Transactions</span>
          <div className="sales-header-today">Today's Sales: {todaysSales}</div>
        </header>
        <div className="sales-add-row">
          <AddSale onDone={handleDone} onToast={onToast} />
        </div>
        <div className="sales-list-row">
          <SaleList key={refresh} onToast={onToast} />
        </div>
        <div className="sales-trend-row">
          <span className="sales-trend-label">Sales trend: <span className="sales-trend-value"></span></span>
        </div>
      </div>
    </motion.div>
  );
}

export default Sales; 