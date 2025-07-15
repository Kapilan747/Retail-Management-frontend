import React, { useState, useEffect, useRef } from 'react';
import { addCustomer, updateCustomer } from '../services/api';
import './AddCustomer.css';

function AddCustomer({ editing, onDone, onToast }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (editing) setForm({ name: editing.name || '', email: editing.email || '', phone: editing.phone || '' });
    else setForm({ name: '', email: '', phone: '' });
  }, [editing]);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, [editing]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDone]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      onToast && onToast('Please fill all required fields', '#d32f2f');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateCustomer(editing.id, form);
        onToast && onToast('Customer updated', '#1976d2');
      } else {
        await addCustomer(form);
        onToast && onToast('Customer added', '#388e3c');
      }
      onDone();
    } catch (err) {
      console.error(err);
      onToast && onToast('Error saving customer', '#d32f2f');
    }
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-customer-form"
      autoComplete="off"
    >
      <div>
        <h2 className="add-customer-title">{editing ? 'Edit Customer' : 'Add Customer'}</h2>
      </div>
      <label className="add-customer-label">
        Name<span style={{ color: '#d32f2f' }}>*</span>
        <input
          ref={nameRef}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter full name"
          className={`add-customer-input${errors.name ? ' error' : ''}`}
        />
        {errors.name && <span className="add-customer-error">{errors.name}</span>}
      </label>
      <label className="add-customer-label">
        Email<span style={{ color: '#d32f2f' }}>*</span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className={`add-customer-input${errors.email ? ' error' : ''}`}
        />
        {errors.email && <span className="add-customer-error">{errors.email}</span>}
      </label>
      <label className="add-customer-label">
        Phone
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number (optional)"
          className="add-customer-input"
        />
      </label>
      <div className="add-customer-actions">
        <button
          className="btn add-customer-btn"
          type="submit"
          disabled={submitting}
        >{submitting ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update' : 'Add')}</button>
        <button
          className="btn add-customer-btn cancel"
          type="button"
          onClick={onDone}
          disabled={submitting}
        >Cancel</button>
      </div>
    </form>
  );
}

export default AddCustomer;
