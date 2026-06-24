import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

const DUMMY_PRODUCTS = [
  { name: 'iPhone 15 Pro', cat: 'Electronics', qty: 12, buy: 899.00, exp: 1099.00, createdAt: Date.now() - 100000 },
  { name: 'MacBook Air M2', cat: 'Electronics', qty: 3, buy: 1050.00, exp: 1299.00, createdAt: Date.now() - 90000 }, // Low stock example
  { name: 'Office Desk Chair', cat: 'Furniture', qty: 15, buy: 85.00, exp: 150.00, createdAt: Date.now() - 80000 },
  { name: 'Wireless Mouse', cat: 'Electronics', qty: 50, buy: 15.00, exp: 35.00, createdAt: Date.now() - 70000 },
  { name: 'Coffee Beans 1kg', cat: 'Food', qty: 45, buy: 12.00, exp: 24.00, createdAt: Date.now() - 60000 },
];

const DUMMY_SALES = [
  { name: 'iPhone 15 Pro', qty: 1, price: 1099.00, income: 1099.00, profit: 200.00, timestamp: Date.now() - 86400000 },
  { name: 'Wireless Mouse', qty: 2, price: 35.00, income: 70.00, profit: 40.00, timestamp: Date.now() - 43200000 },
  { name: 'Coffee Beans 1kg', qty: 3, price: 24.00, income: 72.00, profit: 36.00, timestamp: Date.now() - 10000 },
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('p');
    if (saved && saved !== '[]') return JSON.parse(saved);
    return DUMMY_PRODUCTS;
  });
  
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('s');
    if (saved && saved !== '[]') return JSON.parse(saved);
    return DUMMY_SALES;
  });

  const [businessLogo, setBusinessLogo] = useState(() => {
    return localStorage.getItem('businessLogo') || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z'/%3E%3C/svg%3E";
  });

  useEffect(() => {
    localStorage.setItem('p', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('s', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('businessLogo', businessLogo);
  }, [businessLogo]);

  const addProduct = (product) => {
    const exists = products.find(p => p.name.toLowerCase() === product.name.toLowerCase());
    if (exists && !window.confirm(`"${product.name}" already exists. Add another with same name?`)) return false;
    
    setProducts([...products, { ...product, createdAt: Date.now() }]);
    return true;
  };

  const processSale = (productName, qty, price) => {
    const pIndex = products.findIndex(p => p.name === productName);
    if (pIndex === -1) return null;
    
    const product = products[pIndex];
    if (product.qty < qty) return null;

    const income = qty * price;
    const costBasis = qty * product.buy;
    const profit = income - costBasis;

    const newProducts = [...products];
    newProducts[pIndex].qty -= qty;
    setProducts(newProducts);

    const saleRecord = {
      name: product.name,
      qty,
      price,
      income,
      profit,
      timestamp: Date.now()
    };
    setSales([...sales, saleRecord]);

    return saleRecord;
  };

  return (
    <StoreContext.Provider value={{
      products, sales, businessLogo, setBusinessLogo, addProduct, processSale
    }}>
      {children}
    </StoreContext.Provider>
  );
};
