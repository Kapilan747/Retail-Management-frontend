import React, { useState } from 'react';
import AddProduct from '../components/AddProduct';
import ProductList from '../components/ProductList';
import { motion } from 'framer-motion';
import { FaWarehouse, FaPlus } from 'react-icons/fa';
import './Inventory.css';

const wrapperSlideLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, when: 'beforeChildren', staggerChildren: 0.15 } }
};

function Inventory({ onToast }) {
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const totalSKUs = 25;
  const lowStock = 4;
  const categories = 6;
  const handleDone = () => {
    setEditing(null);
    setShowAdd(false);
    setRefresh(r => !r);
  };
  return (
    <motion.div
      variants={wrapperSlideLeft}
      initial="hidden"
      animate="visible"
      className="inventory-root"
    >
      {showAdd && (
        <div className="inventory-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="inventory-modal-card" onClick={e => e.stopPropagation()}>
            <AddProduct editing={null} onDone={handleDone} onToast={onToast} />
            <button className="btn inventory-modal-close" onClick={() => setShowAdd(false)}>×</button>
          </div>
        </div>
      )}
      <div className="inventory-single-card card">
        <div className="inventory-header-row">
          <FaWarehouse size={36} color="var(--primary)" />
          <div>
            <h1 className="inventory-title">Inventory Management</h1>
            <div className="inventory-subtitle">Track, update, and organize your products</div>
          </div>
          <button className="btn inventory-add-btn" onClick={() => setShowAdd(true)}>
            <FaPlus /> Add Product
          </button>
        </div>
        <div className="inventory-kpi-row">
          <div><b>Total SKUs:</b> {totalSKUs}</div>
          <div><b>Low Stock:</b> {lowStock}</div>
          <div><b>Categories:</b> {categories}</div>
        </div>
        <div className="inventory-products-list">
          <ProductList key={refresh} onEdit={setEditing} onToast={onToast} cardView />
        </div>
      </div>
    </motion.div>
  );
}

export default Inventory; 