import React, { useState, useEffect } from 'react';
import { addOrder, getProducts, updateUserActivity } from '../services/api';
import './PlaceOrderModal.css';

function PlaceOrderModal({ open, onClose, onToast, userId, onOrderPlaced }) {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getProducts().then(res => setProducts(res.data));
      setSelected([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleAddProduct = (product) => {
    if (!selected.find(item => item.product.id === product.id)) {
      setSelected([...selected, { product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelected(selected.filter(item => item.product.id !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelected(selected.map(item => item.product.id === productId ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item));
  };

  const total = selected.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Place Order modal submit triggered');
    if (selected.length === 0) {
      onToast && onToast('Select at least one product', '#d32f2f');
      return;
    }
    setLoading(true);
    try {
      const orderProducts = selected.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));
      const description = orderProducts.map(p => `${p.name} x${p.quantity}`).join(', ');
      const topLevel = orderProducts.length === 1 ? {
        productName: orderProducts[0].name,
        productId: orderProducts[0].productId,
        price: orderProducts[0].price,
        quantity: orderProducts[0].quantity
      } : {};
      await addOrder({
        userId,
        products: orderProducts,
        status: 'pending',
        date: new Date().toISOString(),
        total,
        description,
        ...topLevel
      });
      await updateUserActivity(userId);
      onToast && onToast('Order placed', '#388e3c');
      onOrderPlaced && onOrderPlaced();
      setTimeout(() => { onClose(); }, 100);
    } catch (err) {
      console.error(err);
      onToast && onToast('Error placing order', '#d32f2f');
    }
    setLoading(false);
  };

  return (
    <div className="place-order-modal-overlay" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="place-order-modal-card card">
        <div className="place-order-modal-products">
          <h3 className="place-order-modal-title">Place Order</h3>
          <div className="place-order-modal-label">Select Products:</div>
          <div className="place-order-modal-product-list">
            {products.map(p => (
              <button key={p.id} type="button" className={`btn place-order-modal-product-btn${selected.find(item => item.product.id === p.id) ? ' selected' : ''}`} onClick={() => handleAddProduct(p)} disabled={!!selected.find(item => item.product.id === p.id)}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="place-order-modal-summary-form">
          <div className="place-order-modal-label">Order Summary:</div>
          {selected.length > 0 ? (
            <>
              <table className="place-order-modal-summary-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map(item => (
                    <tr key={item.product.id}>
                      <td>{item.product.name}</td>
                      <td>
                        <input type="number" min={1} value={item.quantity} onChange={e => handleQuantityChange(item.product.id, e.target.value)} className="place-order-modal-qty-input" />
                      </td>
                      <td>₹{(item.product.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button type="button" className="btn place-order-modal-remove-btn" onClick={() => handleRemoveProduct(item.product.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="place-order-modal-total">Total: ₹{total.toFixed(2)}</div>
            </>
          ) : (
            <div className="place-order-modal-empty">No products selected.</div>
          )}
          <div className="place-order-modal-actions flex">
            <button className="btn place-order-modal-cancel" type="button" onClick={onClose} aria-label="Cancel">Cancel</button>
            <button className="btn place-order-modal-submit" type="submit" disabled={loading || selected.length === 0} aria-label="Place Order">{loading ? 'Placing...' : 'Place Order'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaceOrderModal; 