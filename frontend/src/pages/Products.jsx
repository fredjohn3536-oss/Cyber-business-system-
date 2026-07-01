import React, { useState, useContext, useMemo } from 'react';
import { StoreContext } from '../context/StoreContext';
import './Products.css';

const Products = () => {
  const { addProduct, categories, connected } = useContext(StoreContext);

  const [form, setForm] = useState({
    name: '', cat: '', qty: '', buy: '', exp: ''
  });
  const [newCat, setNewCat] = useState(false);

  const catOptions = useMemo(() => {
    const names = categories.map(c => c.name);
    return [...new Set(names)].sort();
  }, [categories]);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, cat, qty, buy, exp } = form;

    if (!name.trim()) return alert("❌ Product name required");
    const parsedQty = parseInt(qty);
    const parsedBuy = parseFloat(buy);
    const parsedExp = parseFloat(exp);

    if (isNaN(parsedQty) || parsedQty < 0) return alert("⚠️ Valid quantity ≥ 0");
    if (isNaN(parsedBuy) || parsedBuy < 0) return alert("⚠️ Valid buying price");
    if (isNaN(parsedExp) || parsedExp < 0) return alert("⚠️ Valid expected price");

    const success = addProduct({
      name: name.trim(),
      cat: cat.trim() || 'General',
      qty: parsedQty,
      buy: parsedBuy,
      exp: parsedExp
    });

    if (success) {
      alert(`✅ "${name}" added! It will appear in Sales under category: ${cat || 'General'}`);
      setForm({ name: '', cat: '', qty: '', buy: '', exp: '' });
      setNewCat(false);
    }
  };

  return (
    <div className="animate-fade-in page-container">
      <h2 className="page-title">📦 Add New Product</h2>

      <div className="glass-panel form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. iPhone 15" autoComplete="off" />
          </div>
          <div className="input-group">
            <label>Category</label>
            {connected && catOptions.length > 0 && !newCat ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select name="cat" value={form.cat} onChange={handleChange} style={{ flex: 1 }}>
                  <option value="">Select category...</option>
                  {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" className="btn-sm" onClick={() => { setNewCat(true); setForm({...form, cat: ''}); }} style={{ whiteSpace: 'nowrap' }}>+ New</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input name="cat" value={form.cat} onChange={handleChange} placeholder="e.g. Electronics, Phone, Food" style={{ flex: 1 }} autoFocus={newCat} />
                {connected && catOptions.length > 0 && (
                  <button type="button" className="btn-sm" onClick={() => setNewCat(false)} style={{ whiteSpace: 'nowrap' }}>Pick</button>
                )}
              </div>
            )}
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Quantity in Stock</label>
              <input type="number" name="qty" value={form.qty} onChange={handleChange} placeholder="0" min="0" />
            </div>
            <div className="input-group">
              <label>Buying Price (Cost)</label>
              <input type="number" name="buy" value={form.buy} onChange={handleChange} placeholder="0.00" step="0.01" min="0" />
            </div>
            <div className="input-group">
              <label>Expected Selling Price</label>
              <input type="number" name="exp" value={form.exp} onChange={handleChange} placeholder="0.00" step="0.01" min="0" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-4">➕ Add Product</button>
        </form>
      </div>

      <div className="info-note mt-6">
        ℹ️ Products added here will immediately appear in the Sales page categorized by their category.
      </div>
    </div>
  );
};

export default Products;
