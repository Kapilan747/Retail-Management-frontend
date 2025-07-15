import React, { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../services/api';
import AddCustomer from './AddCustomer';
import './CustomerList.css';

function CustomerList({ onToast }) {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await getCustomers();
    setCustomers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) {
      await deleteCustomer(id);
      fetchCustomers();
      onToast && onToast('Customer deleted');
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(filter.toLowerCase()))
  );

  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h2 className="customer-list-title">Customers</h2>
        <div className="customer-list-controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="customer-list-search"
          />
          <button
            className="btn customer-list-add-btn"
            onClick={() => { setEditing(null); setModalOpen(true); }}
            aria-label="Add Customer"
          >
            + Add Customer
          </button>
        </div>
      </div>
      {loading ? <div>Loading...</div> : (
        <>
          <table className="table customer-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(customer => (
                <tr key={customer.id} className="customer-list-row">
                  <td style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>{customer.name}</td>
                  <td style={{ color: '#607d8b', fontSize: 15 }}>{customer.email}</td>
                  <td style={{ color: '#607d8b', fontSize: 15 }}>{customer.phone}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn customer-list-action-btn"
                      onClick={() => { setEditing(customer); setModalOpen(true); }}
                      aria-label={`Edit ${customer.name}`}
                    >Edit</button>
                    <button
                      className="btn customer-list-action-btn remove"
                      onClick={() => handleDelete(customer.id)}
                      aria-label={`Delete ${customer.name}`}
                    >Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="customer-list-pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span style={{ alignSelf: 'center', fontWeight: 600 }}>{page} / {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
      {modalOpen && (
        <div className="customer-list-modal" role="dialog" aria-modal="true" tabIndex={-1}>
          <div className="customer-list-modal-inner">
            <AddCustomer
              editing={editing}
              onDone={() => { setModalOpen(false); setEditing(null); fetchCustomers(); }}
              onToast={onToast}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList; 