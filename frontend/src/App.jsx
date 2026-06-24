import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Products from './pages/Products';
import Sales from './pages/Sales';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<Sales />} />
              {/* Add more routes later */}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
