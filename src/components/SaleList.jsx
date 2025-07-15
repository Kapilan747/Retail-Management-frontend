import React, { useEffect, useState } from 'react';
import { getSales } from '../services/api';
import './SaleList.css';

const PAGE_SIZE = 5;

function SaleList({ onToast }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchSales = async () => {
    setLoading(true);
    const res = await getSales();
    setSales(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const totalPages = Math.ceil(sales.length / PAGE_SIZE) || 1;
  const paged = sales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="sale-list-container">
      <div className="sale-list-header">
        <h2 className="sale-list-title">Sales History</h2>
        <span className="sale-list-total">Total: {sales.length}</span>
      </div>
      {loading ? <div>Loading...</div> : (
        <>
          <table className="table sale-list-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((sale) => (
                <tr key={sale.id} className="sale-list-row">
                  <td>{sale.date}</td>
                  <td>{sale.customerName}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sale-list-pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="sale-list-page">{page} / {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default SaleList; 