import React, { useState, useEffect, useRef } from 'react';
import { addProduct, updateProduct } from '../services/api';
import './AddProduct.css';

function AddProduct({ editing, onDone, onToast }) {

  const [form, setForm] = useState({ name: '', 
                                     category: '', 
                                     price: '', 
                                     stock: '' });
  const nameRef = useRef(null);


  useEffect(() => {
    if (editing) setForm(editing);

    else setForm({ name: '', 
                   category: '', 
                   price: '', 
                   stock: '' });

  }, [editing]);


  useEffect(() => {

    if (nameRef.current) nameRef.current.focus();

  }, [editing]);



  const handleChange = e => {
    let value = e.target.value;

    if (e.target.name === 'price' || e.target.name === 'stock') {

      value = Math.max(0, Number(value));

    }

    setForm({ ...form, [e.target.name]: value });
  };



  const handleSubmit = async e => {


    e.preventDefault();


    if (!form.name || !form.price || !form.stock) {

      onToast && onToast('Fill all required fields', '#d32f2f');

      return;
    }


    try {
            if (editing) {
              await updateProduct(editing.id, { ...form, price: Number(form.price), 
                                                         stock: Number(form.stock) });
              onToast && onToast('Product updated', '#1976d2');

            } else {

              await addProduct({ ...form, price: Number(form.price), 
                                          stock: Number(form.stock) });

              onToast && onToast('Product added', '#388e3c');

            }
            onDone();
            setForm({ name: '', category: '', price: '', stock: '' });

    } catch (err) {

            console.error(err);
            onToast && onToast('Error saving product', '#d32f2f');
            
    }
  };

  return (
    <div className="card add-product-root">

      <h2 className="add-product-title">
                {editing ? 'Edit Product' : 'Add Product'}
      </h2>

      <form className="flex add-product-form" onSubmit={handleSubmit}>

        <div className="add-product-row">
          <input 
                  ref={nameRef} 
                  name="name" 
                  placeholder="Name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required className="add-product-input" 
                  aria-label="Product Name" 
          />


          <input 
                  name="category" 
                  placeholder="Category"  
                  value={form.category} 
                  onChange={handleChange} 
                  className="add-product-input" 
                  aria-label="Category" 
          />

        </div>

        <div className="add-product-row">

          <input 
                   name="price" 
                   type="number" 
                   placeholder="Price"
                   value={form.price}
                   onChange={handleChange}
                   required className="add-product-input"
                   aria-label="Price"
                   min="0" 
          />


          <input 
                   name="stock"
                   type="number"
                   placeholder="Stock"
                   value={form.stock}
                   onChange={handleChange}
                   required className="add-product-input"
                   aria-label="Stock"
                   min="0" 
          />
        </div>

        <div className="add-product-actions">

          <button 
                  className="btn add-product-submit" 
                  type="submit" 
                  aria-label={editing ? 'Update Product' : 'Add Product'} 
                  disabled={!form.name || !form.price || !form.stock}
          >
            
                {editing ? 'Update' : 'Add'}
                
          </button>

          {editing && 
                     <button 
                              className="btn add-product-cancel" 
                              type="button" 
                              onClick={() => onDone()} aria-label="Cancel Edit"
                      > 
                          Cancel
                          
                      </button>}
        </div>

      </form>
    </div>
  );
}

export default AddProduct; 