import React, { useEffect, useState, useMemo } from 'react';
import { getOrders } from '../services/api';
import PlaceOrderModal from '../components/PlaceOrderModal';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend as RLegend } from 'recharts';
import { saveAs } from 'file-saver';
import './UserDashboard.css';

const bounceIn = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 14, staggerChildren: 0.12 } }
};
const rotateIn = {
  hidden: { opacity: 0, rotate: -90 },
  visible: { opacity: 1, rotate: 0, transition: { duration: 0.7, type: 'spring', stiffness: 80, damping: 12 } }
};
const popIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};
const slideIn = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, type: 'spring', stiffness: 60, damping: 18 } }
};

function UserDashboard({ onToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const orderRes = await getOrders();
      setOrders(orderRes.data.filter(o => o.userId === user.id));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      onToast && onToast('Failed to load orders', '#d32f2f');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user.id]);

  const myResources = useMemo(() => {
    const approvedOrders = orders.filter(o => o.status === 'approved');
    return approvedOrders.map(order => ({
      id: order.productId,
      name: order.productName,
      category: order.productCategory || 'General', // Assuming category is stored
      price: order.price,
      stock: order.quantity, // Represents the quantity owned by the user
    }));
  }, [orders]);

  const filteredResources = useMemo(() => {
    return myResources.filter(r => {
      let pass = true;
      if (categoryFilter && r.category !== categoryFilter) pass = false;
      return pass;
    });
  }, [myResources, categoryFilter]);

  const filteredOrders = useMemo(() => orders.filter(o => {
    let pass = true;
    if (dateFrom && new Date(o.date) < new Date(dateFrom)) pass = false;
    if (dateTo && new Date(o.date) > new Date(dateTo)) pass = false;
    if (orderStatusFilter && o.status !== orderStatusFilter) pass = false;
    return pass;
  }), [orders, dateFrom, dateTo, orderStatusFilter]);

  const resourcesByCategory = filteredResources.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const ordersByStatus = filteredOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const categoryPieData = Object.keys(resourcesByCategory).map(name => ({ name, value: resourcesByCategory[name] }));
  const ordersPieData = Object.keys(ordersByStatus).map(name => ({ name, value: ordersByStatus[name] }));
  const pieColors = ['#2563eb', '#26c6da', '#ff7043', '#1976d2', '#388e3c'];

  const handleExportOrders = () => {
    const header = 'Order,Status,Date\n';
    const rows = filteredOrders.map(o => [o.description, o.status, o.date].join(','));
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'orders.csv');
  };

  return (
    <motion.div
      variants={bounceIn}
      initial="hidden"
      animate="visible"
      className="userdashboard-root"
    >
      <PlaceOrderModal open={showOrderModal} onClose={() => setShowOrderModal(false)} onToast={onToast} userId={user.id} onOrderPlaced={fetchOrders} />
      <motion.div className="card userdashboard-welcome-card" variants={popIn} initial="hidden" animate="visible">
        <h2 className="userdashboard-welcome-title">Welcome, {user.name || user.username}!</h2>
        <p className="userdashboard-welcome-desc">This is your dashboard. You can view your resources, orders, and place new orders or request goods.</p>
        <div className="button-row userdashboard-action-row">
          <button className="btn userdashboard-placeorder-btn" onClick={() => { console.log('Place Order clicked'); setShowOrderModal(true); }}>Place Order</button>
        </div>
      </motion.div>
      <div className="userdashboard-filters dashboard-filters">
        <label className="userdashboard-filter-label">From: <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="userdashboard-filter-input" /></label>
        <label className="userdashboard-filter-label">To: <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="userdashboard-filter-input" /></label>
        <label className="userdashboard-filter-label">Category: <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="userdashboard-filter-input"><option value="">All</option>{[...new Set(myResources.map(r => r.category))].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></label>
        <label className="userdashboard-filter-label">Order Status: <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} className="userdashboard-filter-input"><option value="">All</option>{[...new Set(orders.map(o => o.status))].map(st => <option key={st} value={st}>{st}</option>)}</select></label>
        <div className="button-row userdashboard-export-row">
          <button className="btn userdashboard-export-btn" type="button" onClick={handleExportOrders}>Export Orders</button>
        </div>
      </div>
      <div className="userdashboard-kpi-row dashboard-row">
        <div className="dashboard-card userdashboard-kpi-card userdashboard-kpi-resources">
          <div className="kpi-label userdashboard-kpi-label">My Resources</div>
          <div className="kpi-value userdashboard-kpi-value userdashboard-kpi-primary">{filteredResources.length}</div>
        </div>
        <div className="dashboard-card userdashboard-kpi-card userdashboard-kpi-orders">
          <div className="kpi-label userdashboard-kpi-label">My Orders</div>
          <div className="kpi-value userdashboard-kpi-value userdashboard-kpi-secondary">{filteredOrders.length}</div>
        </div>
        <div className="dashboard-card userdashboard-kpi-card userdashboard-kpi-pending">
          <div className="kpi-label userdashboard-kpi-label">Pending Requests</div>
          <div className="kpi-value userdashboard-kpi-value userdashboard-kpi-tertiary">{filteredOrders.filter(o => o.status === 'pending').length}</div>
        </div>
      </div>
      <div className="userdashboard-charts-row dashboard-row">
        <div className="dashboard-card userdashboard-chart-card userdashboard-chart-category">
          <h3 className="userdashboard-chart-title userdashboard-primary">Resources by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#2563eb" label>
                {categoryPieData.map((entry, idx) => <Cell key={`cell-cat-${idx}`} fill={pieColors[idx % pieColors.length]} />)}
              </Pie>
              <RLegend />
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-card userdashboard-chart-card userdashboard-chart-orders">
          <h3 className="userdashboard-chart-title userdashboard-secondary">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ordersPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#26c6da" label>
                {ordersPieData.map((entry, idx) => <Cell key={`cell-ord-${idx}`} fill={pieColors[idx % pieColors.length]} />)}
              </Pie>
              <RLegend />
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <motion.div className="card userdashboard-resources-table-card" variants={slideIn} initial="hidden" animate="visible">
        <h3 className="userdashboard-table-title">My Resources</h3>
        {loading ? <div>Loading...</div> : filteredResources.length === 0 ? <div>No resources found.</div> : (
          <table className="table userdashboard-resources-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource.name}</td>
                  <td>{resource.category}</td>
                  <td>₹{resource.price}</td>
                  <td>{resource.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
      <motion.div className="card userdashboard-orders-table-card" variants={rotateIn} initial="hidden" animate="visible">
        <h3 className="userdashboard-table-title">My Orders</h3>
        {loading ? <div>Loading...</div> : filteredOrders.length === 0 ? <div>No orders found.</div> : (
          <table className="table userdashboard-orders-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id || order.id}>
                  <td>{order.date ? order.date.slice(0, 10) : '-'}</td>
                  <td>{order.description}</td>
                  <td className={`userdashboard-status userdashboard-status-${order.status}`}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default UserDashboard; 