import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, addOrder } from '../services/api';
import './Marketplace.css';

function Marketplace({ onToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const productRes = await getProducts();
      setProducts(productRes.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      onToast && onToast('Failed to load products', '#d32f2f');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRequestGoods = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedProduct || quantity < 1) {
      onToast && onToast('Please select a valid quantity', '#d32f2f');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        description: `${selectedProduct.name} - Quantity: ${quantity}`,
        status: 'pending',
        date: new Date().toISOString(),
        quantity: quantity,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price
      };

      await addOrder(orderData);
      onToast && onToast('Request sent to admin successfully', '#388e3c');
      setShowQuantityModal(false);
      setSelectedProduct(null);
      setQuantity(1);
    } catch (err) {
      console.error(err);
      onToast && onToast('Error requesting goods', '#d32f2f');
    }
  };

  const filteredProducts = useMemo(() => products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  ), [products, search]);

  const productsByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  return (
    <div className="marketplace-root">
      <header className="marketplace-header">
        <div className="marketplace-title">Goods Request</div>
        <div className="marketplace-subtitle">Request goods from admin</div>
      </header>
      <main className="marketplace-main">
        <div className="marketplace-search-row">
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="marketplace-search-input"
          />
        </div>

        {/* Resources by Category */}
        <div className="marketplace-category-section">
          <h2 className="marketplace-section-title">Resources by Category</h2>
          {loading ? (
            <div>Loading categories...</div>
          ) : Object.keys(productsByCategory).length === 0 ? (
            <div className="marketplace-empty">No categories found.</div>
          ) : (
            Object.keys(productsByCategory).map(category => (
              <div key={category} className="marketplace-category-card">
                <h3 className="marketplace-category-title">{category}</h3>
                <div className="marketplace-product-grid">
                  {productsByCategory[category].map(p => (
                    <div key={p._id || p.id} className="marketplace-product-card">
                      <div className="marketplace-product-name">{p.name}</div>
                      <div className="marketplace-product-price">₹{p.price}</div>
                      <div className="marketplace-product-stock">Stock: {p.stock}</div>
                      {/* Hide Request button for users with role 'user' */}
                      {user && user.role !== 'user' && (
                        <button 
                          className={`btn marketplace-request-btn${p.stock <= 0 ? ' disabled' : ''}`} 
                          disabled={p.stock <= 0} 
                          onClick={() => handleRequestGoods(p)}
                        >
                          {p.stock > 0 ? 'Request' : 'Out of Stock'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="marketplace-table-card">
          <div className="marketplace-table-title">All Available Goods</div>
          {loading ? <div>Loading...</div> : filteredProducts.length === 0 ? <div className="marketplace-empty">No goods available.</div> : (
            <div className="marketplace-table-scroll">
              <table className="table marketplace-table">
                <thead>
                  <tr>
                    <th className="marketplace-th marketplace-th-product">Product</th>
                    <th className="marketplace-th">Category</th>
                    <th className="marketplace-th">Price</th>
                    <th className="marketplace-th">Stock</th>
                    <th className="marketplace-th marketplace-th-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, i) => (
                    <tr
                      key={p._id || p.id || i}
                      className={`marketplace-row${i % 2 === 0 ? ' even' : ' odd'}${p.stock > 0 ? ' clickable' : ''}`}
                    >
                      <td className="marketplace-td marketplace-td-product">{p.name}</td>
                      <td className="marketplace-td">{p.category || 'General'}</td>
                      <td className="marketplace-td">₹{p.price}</td>
                      <td className="marketplace-td">{p.stock}</td>
                      <td className="marketplace-td marketplace-td-action">
                        <button className={`btn marketplace-request-btn${p.stock <= 0 ? ' disabled' : ''}`} disabled={p.stock <= 0} onClick={() => handleRequestGoods(p)}>
                          {p.stock > 0 ? 'Request Goods' : 'Out of Stock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showQuantityModal && selectedProduct && (
        <div className="marketplace-modal-overlay">
          <div className="card marketplace-modal-card">
            <h3 className="marketplace-modal-title">Request Goods</h3>
            <div className="marketplace-modal-section">
              <label className="marketplace-modal-label">Product:</label>
              <div className="marketplace-modal-product">{selectedProduct.name} - ₹{selectedProduct.price}</div>
            </div>
            <div className="marketplace-modal-section">
              <label className="marketplace-modal-label">Quantity:</label>
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(selectedProduct.stock, parseInt(e.target.value) || 1)))}
                className="marketplace-modal-qty-input"
              />
              <div className="marketplace-modal-stock">Available stock: {selectedProduct.stock}</div>
            </div>
            <div className="marketplace-modal-summary">
              <div className="marketplace-modal-summary-row">
                <span className="marketplace-modal-summary-label">Unit Price:</span>
                <span className="marketplace-modal-summary-value">₹{selectedProduct.price}</span>
              </div>
              <div className="marketplace-modal-summary-row">
                <span className="marketplace-modal-summary-label">Quantity:</span>
                <span className="marketplace-modal-summary-value">{quantity}</span>
              </div>
              <div className="marketplace-modal-summary-row total">
                <span className="marketplace-modal-summary-label total">Total Price:</span>
                <span className="marketplace-modal-summary-value total">₹{(selectedProduct.price * quantity).toFixed(2)}</span>
              </div>
            </div>
            <div className="marketplace-modal-actions">
              <button 
                className="btn marketplace-modal-cancel" 
                onClick={() => setShowQuantityModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn marketplace-modal-submit" 
                onClick={handleSubmitRequest}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace; 