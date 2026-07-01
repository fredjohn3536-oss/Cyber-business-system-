import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';
import DashboardLayout from '../layout/Dashboard';
import { useAuth } from '../context/AuthContext';

const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const SellerDashboard = lazy(() => import('../pages/SellerDashboard'));
const Admin = lazy(() => import('../pages/Admin'));
const Products = lazy(() => import('../pages/Products'));
const ProductList = lazy(() => import('../pages/ProductList'));
const Sales = lazy(() => import('../pages/Sales'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

function DashboardRedirect() {
  const { user } = useAuth();
  const role = user?.role || 'seller';
  if (role === 'seller' || role === 'manager') {
    return <Navigate to="/seller-dashboard" replace />;
  }
  return <Navigate to="/admin" replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/management" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/sales" element={<Sales />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
