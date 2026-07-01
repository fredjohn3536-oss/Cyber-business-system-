import React, { createContext, useState, useEffect, useCallback } from 'react';
import { productsAPI, salesAPI, categoriesAPI, adminAPI } from '../services/api';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [businessLogo, setBusinessLogo] = useState(() => {
    return localStorage.getItem('businessLogo') || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z'/%3E%3C/svg%3E";
  });

  const mapProduct = (p) => ({
    id: p.id,
    name: p.product_name,
    cat: p.category_name || 'General',
    catId: p.category_id,
    qty: p.stock_quantity,
    buy: parseFloat(p.buying_price),
    exp: parseFloat(p.selling_price),
    createdAt: Date.parse(p.created_at),
  });

  const mapSale = (s) => ({
    id: s.id,
    name: s.items?.[0]?.product_name || `Sale #${s.id}`,
    qty: s.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
    price: parseFloat(s.total_amount),
    income: parseFloat(s.total_amount),
    profit: parseFloat(s.total_profit),
    timestamp: Date.parse(s.created_at),
  });

  const getOrCreateCategoryId = async (catName, token) => {
    if (!token || !catName || catName === 'General') return null;
    const existing = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (existing) return existing.id;
    try {
      const res = await categoriesAPI.create({ name: catName });
      setCategories(prev => [...prev, res.data]);
      return res.data.id;
    } catch {
      const localId = Date.now();
      setCategories(prev => [...prev, { id: localId, name: catName, business_id: 0 }]);
      return localId;
    }
  };

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { setLoading(false); return; }
    try {
      const [prodRes, salesRes, catRes] = await Promise.all([
        productsAPI.list({}),
        salesAPI.list(),
        categoriesAPI.list(),
      ]);
      setProducts(prodRes.data.map(mapProduct));
      setSales(salesRes.data.map(mapSale));
      setCategories(catRes.data);
      setConnected(true);

      try {
        const bizRes = await adminAPI.getBusiness();
        if (bizRes.data.logo_url) {
          setBusinessLogo(bizRes.data.logo_url);
          localStorage.setItem('businessLogo', bizRes.data.logo_url);
        }
      } catch {}
    } catch {
      const cachedP = localStorage.getItem('p');
      const cachedS = localStorage.getItem('s');
      if (cachedP) setProducts(JSON.parse(cachedP));
      if (cachedS) setSales(JSON.parse(cachedS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (products.length) localStorage.setItem('p', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (sales.length) localStorage.setItem('s', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => { localStorage.setItem('businessLogo', businessLogo); }, [businessLogo]);

  const addProduct = async (product) => {
    const token = localStorage.getItem('access_token');

    if (connected && token) {
      const categoryId = await getOrCreateCategoryId(product.cat, token);
      try {
        const payload = {
          product_name: product.name,
          stock_quantity: product.qty,
          buying_price: product.buy,
          selling_price: product.exp,
        };
        if (categoryId) payload.category_id = categoryId;
        const res = await productsAPI.create(payload);
        setProducts(prev => [...prev, mapProduct(res.data)]);
        return true;
      } catch (err) {
        if (err.response?.status === 401) return false;
      }
    }

    const offline = { ...product, id: Date.now(), createdAt: Date.now() };
    setProducts(prev => [...prev, offline]);
    return true;
  };

  const processSale = async (productName, qty, price) => {
    const pIndex = products.findIndex(p => p.name === productName);
    if (pIndex === -1) return null;
    const product = products[pIndex];
    if (product.qty < qty) return null;

    const income = qty * price;
    const profit = (price - product.buy) * qty;

    if (connected && product.id) {
      try {
        await salesAPI.create({
          items: [{ product_id: product.id, quantity: qty, selling_price: price }],
          payment_method: 'cash',
        });
        const updated = [...products];
        updated[pIndex].qty -= qty;
        setProducts(updated);
        const record = { name: product.name, qty, price, income, profit, timestamp: Date.now() };
        setSales(prev => [...prev, record]);
        return record;
      } catch {}
    }

    const updated = [...products];
    updated[pIndex].qty -= qty;
    setProducts(updated);
    const record = { name: product.name, qty, price, income, profit, timestamp: Date.now() };
    setSales(prev => [...prev, record]);
    return record;
  };

  const updateLogo = async (dataUrl) => {
    setBusinessLogo(dataUrl);
    if (connected) {
      try {
        await adminAPI.updateBusiness({ logo_url: dataUrl });
      } catch {}
    }
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts, sales, setSales,
      categories, businessLogo,
      addProduct, processSale, loading, fetchAll, connected,
      setBusinessLogo: updateLogo,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
