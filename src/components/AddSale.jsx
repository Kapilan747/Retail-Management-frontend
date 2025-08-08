import React, { useEffect, useState, useRef } from 'react';
import { getProducts, getCustomers, addSale, updateProduct } from '../services/api';
import './AddSale.css';

function AddSale({ onDone, onToast }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customerId: '', productId: '', quantity: 1 });
  const [loading, setLoading] = useState(true);
  const customerRef = useRef(null);

  useEffect(() => {

    const fetchData = async () => {

      setLoading(true);
      const [prodRes, custRes] = await Promise.all([getProducts(), getCustomers()]);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setLoading(false);
      
    };

    fetchData();
  }, []);

  useEffect(() => {

    if (customerRef.current) customerRef.current.focus();

  }, [loading]);

  const handleChange = e => {

    let value = e.target.value;
    if (e.target.name === 'quantity') {
      value = Math.max(1, Number(value));
    }
    setForm({ ...form, [e.target.name]: value });

  };

  const handleSubmit = async e => {

    e.preventDefault();
    const product = products.find(p => p.id === Number(form.productId));
    const customer = customers.find(c => c.id === Number(form.customerId));

    if (!product || !customer) {
      onToast && onToast('Select valid product and customer', '#d32f2f');
      return;
    }

    if (product.stock < form.quantity) {
      onToast && onToast('Not enough stock', '#d32f2f');
      return;
    }

    try {
      const sale = {

        date: new Date().toLocaleDateString(),
        customerId: customer.id,
        customerName: customer.name,
        productId: product.id,
        productName: product.name,
        quantity: Number(form.quantity),
        total: Number(form.quantity) * product.price

      };


      await addSale(sale);
      await updateProduct(product.id, { ...product, stock: product.stock - Number(form.quantity) });
      onDone();


      setForm({ customerId: '', productId: '', quantity: 1 });
      onToast && onToast('Sale recorded', '#388e3c');


    } catch (err) {

      console.error(err);
      onToast && onToast('Error recording sale', '#d32f2f');


    }
  };

  return (
    <div className="add-sale-container">

      <h2 className="add-sale-title">Record Sale</h2>


      <form className="add-sale-form" onSubmit={handleSubmit}>


        <select 
                name="customerId" 
                value={form.customerId} 
                onChange={handleChange} 
                required aria-label="Select Customer" 
                ref={customerRef} 
                className="add-sale-select"
        >

                <option value="">Select Customer</option>

                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}


        </select>


        <select 
                name="productId" 
                value={form.productId} 
                onChange={handleChange} 
                required aria-label="Select Product" 
                className="add-sale-select"
        >


                <option value="">Select Product</option>


                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}

        </select>


        <input 
                name="quantity" 
                type="number" 
                min="1" 
                max={products.find(p => p.id === Number(form.productId))?.stock || 1} 
                value={form.quantity} 
                onChange={handleChange} 
                className="add-sale-input" 
                required aria-label="Quantity" 
        />


        <button 
                className="btn add-sale-btn" 
                type="submit" 
                aria-label="Record Sale" 
                disabled={loading || !form.customerId || !form.productId}
        >
              Record
        </button>


      </form>
    </div>
  );
}

export default AddSale; 