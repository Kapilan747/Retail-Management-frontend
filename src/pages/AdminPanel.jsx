import React, { useEffect, useState } from 'react';
import { getUsers, getOrders, updateOrder, updateUserActivity } from '../services/api';
import { motion } from 'framer-motion';
import dashboardLogo from '../images/dashboard-logo.png';
import './AdminPanel.css';

const rotateIn = {
  hidden: { opacity: 0, rotate: -8, y: 40 },
  visible: { opacity: 1, rotate: 0, y: 0, transition: { duration: 0.7, type: 'spring', stiffness: 60, damping: 18, when: 'beforeChildren', staggerChildren: 0.12 } }
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } }
};
const slideRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, type: 'spring', stiffness: 60, damping: 18 } }
};

function AdminPanel({ onToast }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          if (user && user.id) {
            await updateUserActivity(user.id, true);
          }
        } catch (err) {
          console.error('Error clearing activity on timeout:', err);
        }
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        window.location.href = '/sign-in';
      }, 4 * 60 * 1000);
    };
    
    const updateActivity = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.id) {
          console.log('Updating activity for user:', user.id);
          await updateUserActivity(user.id);
        }
      } catch (err) {
        console.error('Error updating activity:', err);
      }
    };

    const updateActivityOnLoad = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.id) {
          console.log('Initial activity update for user:', user.id);
          await updateUserActivity(user.id);
        }
      } catch (err) {
        console.error('Error updating initial activity:', err);
      }
    };

    window.addEventListener('mousemove', () => {
      resetTimer();
      updateActivity();
    });
    window.addEventListener('keydown', () => {
      resetTimer();
      updateActivity();
    });
    window.addEventListener('click', () => {
      resetTimer();
      updateActivity();
    });
    
    updateActivityOnLoad();
    resetTimer();
    
    const activityInterval = setInterval(updateActivity, 30000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(activityInterval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, []);

  const isUserActive = (user) => {
    if (!user.lastActive) return false;
    const timeDiff = Date.now() - new Date(user.lastActive).getTime();
    const isActive = timeDiff < 1 * 60 * 1000;
    
    if (user.username === 'admin') {
      console.log('Admin activity debug:', {
        username: user.username,
        lastActive: user.lastActive,
        currentTime: new Date().toISOString(),
        timeDiff: timeDiff,
        timeDiffMinutes: timeDiff / (1000 * 60),
        isActive: isActive
      });
    }
    
    return isActive;
  };

  const fetchAll = async () => {
    setLoading(true);
    const [userRes, orderRes] = await Promise.all([
      getUsers(),
      getOrders()
    ]);
    setUsers(userRes.data);
    setOrders(orderRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const getUserName = (id) => {
    const u = users.find(u => u.id === id);
    return u ? u.name || u.username : 'Unknown';
  };

  const handleOrderAction = async (order, status) => {
    try {
      await updateOrder(order._id || order.id, { status }); // Only send status
      onToast && onToast(`Request ${status}`, status === 'approved' ? '#388e3c' : '#d32f2f');
      fetchAll();
    } catch (err) {
      console.error(err);
      onToast && onToast('Error updating request', '#d32f2f');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'approved': return '#4caf50';
      case 'denied': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'denied': return 'Denied';
      default: return status;
    }
  };

  return (
    <motion.div
      variants={rotateIn}
      initial="hidden"
      animate="visible"
      className="adminpanel-root"
    >
      <div className="adminpanel-header">
        <h1 className="adminpanel-title">Admin Panel</h1>
        <div className="adminpanel-time">Current Time: {new Date().toLocaleString()}</div>
      </div>
      <motion.div className="card adminpanel-users-card" variants={fadeIn} initial="hidden" animate="visible">
        <h2 className="adminpanel-section-title">All Users</h2>
        {loading ? <div>Loading...</div> : (
          <table className="table adminpanel-users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Role</th>
                <th>Active</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role !== 'admin').map(u => (
                <tr key={u._id || u.id}>
                  <td>{u.username}</td>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>
                    {isUserActive(u) ? (
                      <span className="adminpanel-active">&#9679; Active</span>
                    ) : (
                      <span className="adminpanel-inactive">&#9679; Inactive</span>
                    )}
                  </td>
                  <td>{u.lastActive ? new Date(u.lastActive).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
      <motion.div className="card adminpanel-requests-card" variants={slideRight} initial="hidden" animate="visible">
        <h2 className="adminpanel-section-title">Goods Requests</h2>
        {loading ? <div>Loading...</div> : orders.length === 0 ? (
          <div className="adminpanel-empty-requests">
            <div className="adminpanel-empty-icon">📦</div>
            <div className="adminpanel-empty-title">No requests yet</div>
            <div className="adminpanel-empty-desc">Users can request goods from the Marketplace</div>
          </div>
        ) : (
          <table className="table adminpanel-requests-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id || order.id}>
                  <td className="adminpanel-date">{order.date ? new Date(order.date).toLocaleString() : '-'}</td>
                  <td className="adminpanel-username">{getUserName(order.userId)}</td>
                  <td className="adminpanel-product-name">{order.productName || (order.products && order.products[0] ? order.products[0].name : order.description)}</td>
                  <td className="adminpanel-qty">{order.quantity || (order.products && order.products[0] ? order.products[0].quantity : '-')}</td>
                  <td className="adminpanel-price">{order.price ? `₹${order.price.toFixed(2)}` : (order.products && order.products[0] ? `₹${order.products[0].price.toFixed(2)}` : '-')}</td>
                  <td className="adminpanel-total">{order.total ? `₹${order.total.toFixed(2)}` : '-'}</td>
                  <td>
                    <span
                      className="adminpanel-status"
                      style={{
                        '--status-color': getStatusColor(order.status),
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="adminpanel-action-btns">
                    {order.status === 'pending' ? (
                      <>
                        <button className="btn adminpanel-approve" onClick={() => handleOrderAction(order, 'approved')}>Approve</button>
                        <button className="btn adminpanel-deny" onClick={() => handleOrderAction(order, 'denied')}>Deny</button>
                      </>
                    ) : (
                      <span className="adminpanel-status-final">
                        {order.status === 'approved' ? 'Approved' : 'Denied'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default AdminPanel; 