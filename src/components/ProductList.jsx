import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import './ProductList.css';

const PAGE_SIZE = 5;

function ProductList({ onEdit, onToast, cardView }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProducts();
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
      onToast && onToast('Product deleted');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(filter.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="product-list-root">
      <div className="flex-between product-list-header">
        <h2 className="product-list-title">Products</h2>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="product-list-search"
        />
      </div>
      {loading ? <div>Loading...</div> : cardView ? (
        <>
          <div className="product-list-card-grid">
            {paged.map(product => (
              <div key={product._id || product.id} className="dashboard-card product-list-card">
                <div className="product-list-card-image">
                  <img src={product.image && product.image.trim() ? product.image : 'https://images.unsplash.com/photo-1513708927688-890a1e2b6e54?auto=format&fit=crop&w=400&q=80'} alt={product.name} className="product-list-img" />
                </div>
                <div className="product-list-card-content">
                  <div className="product-list-card-name">{product.name}</div>
                  <div className="product-list-card-category">{product.category || 'Uncategorized'}</div>
                  <div className="product-list-card-price">Price: <span className="product-list-card-price-value">${product.price}</span></div>
                  <div className="product-list-card-stock">Stock: {product.stock === 0 ? <span className="product-list-card-out">Out of Stock</span> : product.stock}</div>
                  <div className="product-list-card-actions">
                    <button className="btn" onClick={() => onEdit(product)}>Edit</button>
                    <button className="btn product-list-delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex product-list-pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="product-list-page-info">{page} / {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      ) : (
        <>
          <table className="table product-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(product => (
                <tr key={product._id || product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    {product.stock === 0 ? (
                      <span className="product-list-card-out">Out of Stock</span>
                    ) : product.stock}
                  </td>
                  <td>
                    <button className="btn" onClick={() => onEdit(product)}>Edit</button>
                    <button className="btn product-list-delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex product-list-pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="product-list-page-info">{page} / {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList; 