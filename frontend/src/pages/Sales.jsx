import React, { useState, useContext, useMemo } from 'react';
import { StoreContext } from '../context/StoreContext';
import './Sales.css';

const Sales = () => {
  const { products, processSale } = useContext(StoreContext);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [receipt, setReceipt] = useState(null);
  
  const [sellForms, setSellForms] = useState({});

  const categories = useMemo(() => {
    const cats = products.map(p => p.cat && p.cat.trim() !== "" ? p.cat.trim() : "General");
    return ["All", ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (currentCategory === 'All') return products;
    return products.filter(p => (p.cat && p.cat.trim() === currentCategory) || (currentCategory === "General" && (!p.cat || p.cat.trim() === "")));
  }, [products, currentCategory]);

  const handleFormChange = (productName, field, value) => {
    setSellForms(prev => ({
      ...prev,
      [productName]: {
        ...prev[productName],
        [field]: value
      }
    }));
  };

  const handleSell = (product) => {
    const form = sellForms[product.name] || {};
    const qty = parseInt(form.qty);
    const price = parseFloat(form.price);

    if (isNaN(qty) || qty <= 0) return alert("⚠️ Enter valid quantity > 0");
    if (isNaN(price) || price < 0) return alert("⚠️ Enter valid sale price");
    if (product.qty < qty) return alert(`❌ Insufficient stock! Only ${product.qty} left.`);

    const saleRecord = processSale(product.name, qty, price);
    if (saleRecord) {
      setReceipt(saleRecord);
      handleFormChange(product.name, 'qty', '');
      handleFormChange(product.name, 'price', '');
      
      // Auto-scroll logic could go here
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in page-container">
      <h2 className="page-title">💸 Point of Sale</h2>
      
      <div className="category-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`cat-btn ${currentCategory === cat ? 'active-cat' : ''}`}
            onClick={() => setCurrentCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-cat">📭 No products in "{currentCategory}" category. Add products from Products page.</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.name} className="product-sell-card glass-panel">
              <div className="product-info">
                <strong className="product-name">{product.name}</strong>
                <div className="product-stats">
                  <span>📦 Stock: <b>{product.qty}</b></span>
                  <span>💰 Cost: ${product.buy?.toFixed(2)}</span>
                  <span>💵 Expected: ${product.exp?.toFixed(2)}</span>
                </div>
                {product.qty <= 3 ? <span className="status low">⚠️ Low stock</span> : <span className="status ok">✓ In Stock</span>}
              </div>
              <div className="sell-form">
                <input 
                  type="number" 
                  placeholder="Qty" 
                  min="1" 
                  max={product.qty}
                  value={sellForms[product.name]?.qty || ''}
                  onChange={(e) => handleFormChange(product.name, 'qty', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Price" 
                  step="0.01"
                  value={sellForms[product.name]?.price || ''}
                  onChange={(e) => handleFormChange(product.name, 'price', e.target.value)}
                />
                <button className="sell-btn" onClick={() => handleSell(product)}>Sell</button>
              </div>
            </div>
          ))
        )}
      </div>

      {receipt && (
        <div className="receipt-area glass-panel mt-8">
          <div className="receipt-title">🧾 Transaction Receipt</div>
          <div className="receipt-details">
            <p><strong>Item:</strong> {receipt.name}</p>
            <p><strong>Quantity:</strong> {receipt.qty}</p>
            <p><strong>Unit Price:</strong> ${receipt.price.toFixed(2)}</p>
            <p><strong>Total Income:</strong> ${receipt.income.toFixed(2)}</p>
            <p className="profit"><strong>Profit:</strong> ${receipt.profit.toFixed(2)}</p>
            <p><strong>Time:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
            <hr className="receipt-divider"/>
            <p className="success-msg">✅ Transaction completed successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
