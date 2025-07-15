import React, { useEffect, useState } from 'react';
import { getProducts, getOrders, getCustomers } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend as RLegend } from 'recharts';
import { saveAs } from 'file-saver';
import dashboardLogo from '../images/dashboard-logo.png';
import { FaBoxOpen, FaUsers, FaClipboardList, FaExclamationCircle } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [prodRes, orderRes, custRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getCustomers()
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setCustomers(custRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredOrders = orders.filter(order => {
    let pass = true;
    if (dateFrom && new Date(order.date) < new Date(dateFrom)) pass = false;
    if (dateTo && new Date(order.date) > new Date(dateTo)) pass = false;
    if (customerFilter && String(order.userId) !== customerFilter) pass = false;
    if (productFilter && !order.description.toLowerCase().includes(products.find(p => p.id === productFilter)?.name?.toLowerCase() || '')) pass = false;
    return pass;
  });

  const requestsByProduct = {};
  const requestsByCustomer = {};
  const requestsTrend = {};
  const pendingRequests = filteredOrders.filter(o => o.status === 'pending');
  filteredOrders.forEach(order => {
    const date = order.date ? order.date.slice(0, 10) : 'Unknown';
    requestsTrend[date] = (requestsTrend[date] || 0) + 1;
    const productName = order.description || 'Unknown Product';
    requestsByProduct[productName] = (requestsByProduct[productName] || 0) + 1;
    const customer = customers.find(c => c.id === order.userId);
    const customerName = customer ? customer.name : order.userId;
    requestsByCustomer[customerName] = (requestsByCustomer[customerName] || 0) + 1;
  });
  const requestsData = Object.keys(requestsByProduct).map(name => ({ name, requests: requestsByProduct[name] }));
  const trendData = Object.keys(requestsTrend).sort().map(date => ({ date, requests: requestsTrend[date] }));
  const customerData = Object.keys(requestsByCustomer).map(name => ({ name, requests: requestsByCustomer[name] }));
  const topProductsByRequests = requestsData.sort((a, b) => b.requests - a.requests).slice(0, 5);
  const topCustomersByRequests = customerData.sort((a, b) => b.requests - a.requests).slice(0, 5);

  const handleExportCSV = () => {
    const header = 'Date,Customer,Product,Status\n';
    const rows = filteredOrders.map(order => {
      const customer = customers.find(c => c.id === order.userId);
      return [order.date, customer?.name || order.userId, order.description, order.status].join(',');
    }).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'requests_data.csv');
  };

  return (
    <div className="dashboard-root">
      <main className="dashboard-main">
        <div className="dashboard-kpi-row">
          <div className="dashboard-kpi-card dashboard-kpi-products">
            <FaBoxOpen size={36} color="#1a73e8" className="dashboard-kpi-icon" />
            <div className="dashboard-kpi-label">Total Products</div>
            <div className="dashboard-kpi-value dashboard-kpi-primary">{products.length}</div>
          </div>
          <div className="dashboard-kpi-card dashboard-kpi-pending">
            <FaClipboardList size={36} color="#4caf50" className="dashboard-kpi-icon" />
            <div className="dashboard-kpi-label">Pending Requests</div>
            <div className="dashboard-kpi-value dashboard-kpi-secondary">{pendingRequests.length}</div>
          </div>
          <div className="dashboard-kpi-card dashboard-kpi-customers">
            <FaUsers size={36} color="#ff9800" className="dashboard-kpi-icon" />
            <div className="dashboard-kpi-label">Total Customers</div>
            <div className="dashboard-kpi-value dashboard-kpi-tertiary">{customers.length}</div>
          </div>
          <div className="dashboard-kpi-card dashboard-kpi-outofstock">
            <FaExclamationCircle size={36} color="#f44336" className="dashboard-kpi-icon" />
            <div className="dashboard-kpi-label">Out of Stock</div>
            <div className="dashboard-kpi-value dashboard-kpi-out">{products.filter(p => p.stock === 0).length}</div>
          </div>
        </div>
        <div className="dashboard-filters">
          <label className="dashboard-filter-label">From: <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="dashboard-filter-input" /></label>
          <label className="dashboard-filter-label">To: <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="dashboard-filter-input" /></label>
          <label className="dashboard-filter-label">Product: <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="dashboard-filter-input"><option value="">All</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="dashboard-filter-label">Customer: <select value={customerFilter} onChange={e => setCustomerFilter(e.target.value)} className="dashboard-filter-input"><option value="">All</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <button className="btn dashboard-export-btn" type="button" onClick={handleExportCSV}>Export CSV</button>
        </div>
        <div className="dashboard-charts-row">
          <div className="dashboard-chart-card dashboard-trend">
            <div className="dashboard-chart-title dashboard-primary">Requests Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e7" />
                <XAxis dataKey="date" stroke="#5f6368" />
                <YAxis stroke="#5f6368" />
                <RTooltip contentStyle={{ background: '#fff', color: '#202124', border: '1px solid #e0e3e7' }} />
                <Line type="monotone" dataKey="requests" stroke="#1a73e8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-chart-card dashboard-products">
            <div className="dashboard-chart-title dashboard-secondary">Top Products (Requests)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProductsByRequests} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e7" />
                <XAxis dataKey="name" stroke="#5f6368" />
                <YAxis stroke="#5f6368" />
                <RTooltip contentStyle={{ background: '#fff', color: '#202124', border: '1px solid #e0e3e7' }} />
                <Bar dataKey="requests" fill="#1a73e8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-chart-card dashboard-customers">
            <div className="dashboard-chart-title dashboard-tertiary">Top Customers (Requests)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCustomersByRequests} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e7" />
                <XAxis dataKey="name" stroke="#5f6368" />
                <YAxis stroke="#5f6368" />
                <RTooltip contentStyle={{ background: '#fff', color: '#202124', border: '1px solid #e0e3e7' }} />
                <Bar dataKey="requests" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-recent-requests">
          <div className="dashboard-recent-title">Recent Requests</div>
          <table className="table dashboard-recent-table">
            <thead className="dashboard-recent-thead">
              <tr className="dashboard-recent-header-row">
                <th className="dashboard-recent-th dashboard-recent-th-date">Date</th>
                <th className="dashboard-recent-th">Customer</th>
                <th className="dashboard-recent-th">Product</th>
                <th className="dashboard-recent-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 10).map((order, idx) => (
                <tr key={order.id || idx} className={`dashboard-recent-row${idx % 2 === 0 ? ' even' : ' odd'}`}>
                  <td className="dashboard-recent-td">{order.date ? order.date.slice(0, 10) : '-'}</td>
                  <td className="dashboard-recent-td">{customers.find(c => c.id === order.userId)?.name || order.userId}</td>
                  <td className="dashboard-recent-td">{order.description}</td>
                  <td className="dashboard-recent-td">
                    <span className={`dashboard-status dashboard-status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 