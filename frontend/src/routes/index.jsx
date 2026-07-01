import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/Loader';
import DashboardLayout from '../layout/Dashboard';

const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Admin = lazy(() => import('../pages/Admin'));
const Products = lazy(() => import('../pages/Products'));
const ProductList = lazy(() => import('../pages/ProductList'));
const Sales = lazy(() => import('../pages/Sales'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
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
