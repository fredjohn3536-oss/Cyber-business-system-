import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { productsAPI, categoriesAPI } from '../services/api';
import './ProductList.css';

const ProductList = () => {
  const { products, setProducts } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.list();
      setCategories(res.data);
    } catch {
      // offline mode
    }
  };

  const handleDelete = async (productIndex) => {
    const p = products[productIndex];
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await productsAPI.delete(p.id);
    } catch {
      // offline
    }
    const updated = products.filter((_, i) => i !== productIndex);
    setProducts(updated);
  };

  const startEdit = (product, index) => {
    setEditingId(index);
    setEditForm({
      product_name: product.name,
      cat: product.cat || 'General',
      qty: product.qty,
      buy: product.buy,
      exp: product.exp,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (index) => {
    const p = products[index];
    try {
      await productsAPI.update(p.id, {
        product_name: editForm.product_name,
        selling_price: parseFloat(editForm.exp),
        buying_price: parseFloat(editForm.buy),
        stock_quantity: parseInt(editForm.qty),
      });
    } catch {
      // offline
    }
    const updated = [...products];
    updated[index] = {
      ...p,
      name: editForm.product_name,
      cat: editForm.cat,
      qty: parseInt(editForm.qty),
      buy: parseFloat(editForm.buy),
      exp: parseFloat(editForm.exp),
    };
    setProducts(updated);
    setEditingId(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in page-container">
      <div className="page-header">
        <h2 className="page-title">📋 Inventory</h2>
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-cat">
          {search ? `No products matching "${search}"` : 'No products yet. Add some from the Products page!'}
        </div>
      ) : (
        <div className="product-list">
          {filtered.map((product, idx) => {
            const realIdx = products.indexOf(product);
            const isEditing = editingId === realIdx;

            return (
              <div key={product.name + product.createdAt} className="product-list-item glass-panel">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="edit-row">
                      <label>Name</label>
                      <input value={editForm.product_name} onChange={(e) => setEditForm({...editForm, product_name: e.target.value})} />
                    </div>
                    <div className="edit-row">
                      <label>Category</label>
                      <input value={editForm.cat} onChange={(e) => setEditForm({...editForm, cat: e.target.value})} />
                    </div>
                    <div className="edit-row">
                      <label>Qty</label>
                      <input type="number" value={editForm.qty} onChange={(e) => setEditForm({...editForm, qty: e.target.value})} />
                    </div>
                    <div className="edit-row">
                      <label>Buy Price</label>
                      <input type="number" step="0.01" value={editForm.buy} onChange={(e) => setEditForm({...editForm, buy: e.target.value})} />
                    </div>
                    <div className="edit-row">
                      <label>Sell Price</label>
                      <input type="number" step="0.01" value={editForm.exp} onChange={(e) => setEditForm({...editForm, exp: e.target.value})} />
                    </div>
                    <div className="edit-actions">
                      <button className="btn-sm save-btn" onClick={() => saveEdit(realIdx)}>💾 Save</button>
                      <button className="btn-sm cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="product-list-info">
                      <div className="pl-name">
                        <strong>{product.name}</strong>
                        <span className="pl-category">{product.cat || 'General'}</span>
                      </div>
                      <div className="pl-details">
                        <span>📦 <b>{product.qty}</b> in stock</span>
                        <span>💰 Cost: TSh {product.buy?.toFixed(2)}</span>
                        <span>💵 Sell: TSh {product.exp?.toFixed(2)}</span>
                        <span>📈 Margin: TSh {((product.exp || 0) - (product.buy || 0)).toFixed(2)}</span>
                      </div>
                      {product.qty <= 3 && <span className="status low">⚠️ Low stock</span>}
                    </div>
                    <div className="product-list-actions">
                      <button className="btn-sm edit-btn" onClick={() => startEdit(product, realIdx)}>✏️ Edit</button>
                      <button className="btn-sm delete-btn" onClick={() => handleDelete(realIdx)}>🗑️ Delete</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
