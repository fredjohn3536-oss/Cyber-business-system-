import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProductList from './pages/ProductList';

function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
            <Route path="/products" element={<ProtectedLayout><Products /></ProtectedLayout>} />
            <Route path="/products/list" element={<ProtectedLayout><ProductList /></ProtectedLayout>} />
            <Route path="/sales" element={<ProtectedLayout><Sales /></ProtectedLayout>} />
            <Route path="/admin" element={<ProtectedLayout><Admin /></ProtectedLayout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
