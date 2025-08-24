import { Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import About from "../pages/about/About";
import Register from "../pages/auth/Register";
import Layout from "../components/layout/Layout";
import NotFound from "../pages/notFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AdminRegister from "../pages/admin/AdminRegister";
import UserManagement from "../pages/admin/UserManagement";
import ProductAdditionPage from "../pages/products/ProductAdditionPage";
import ProductManagement from "../pages/products/ProductManagement";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes - redirect to home if already authenticated */}
        <Route
          path="login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="register"
          element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/register"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="admin">
              <AdminRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/users"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route index element={<Home />} />

        {/* Protected routes - require authentication */}

        <Route
          path="about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="products/add"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="employee">
              <ProductAdditionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="products/manage"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="employee">
              <ProductManagement />
            </ProtectedRoute>
          }
        />

        {/* 404 page - public */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
