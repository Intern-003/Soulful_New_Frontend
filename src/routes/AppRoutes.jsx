import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/common/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Attributes from "../pages/dashboard/Attributes";

// Pages
import Home from "../pages/public/Home";
// import Login from "../pages/auth/Login";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/dashboard/Products";
import Users from "../pages/dashboard/Users";
import Categories from "../pages/dashboard/Categories";
import Cart from "../pages/user/Cart";
import Roles from "../pages/dashboard/Roles";
import ShopPage from "../pages/public/ShopPage";
import Wishlist from "../pages/public/Wishlist";
import Contact from "../pages/public/Contact";
import VendorOrdersPage from "../pages/dashboard/VendorOrdersPage";
import VendorOrderDetailsPage from "../pages/dashboard/VendorOrderDetailsPage";
import AdminOrderDetailsPage from "../pages/dashboard/AdminOrderDetailsPage";
import AdminOrdersPage from "../pages/dashboard/AdminOrdersPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MAIN WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<VendorOrdersPage />} />
        <Route path="orders/:id" element={<VendorOrderDetailsPage />} />
        <Route path="users" element={<Users />} />
        <Route path="categories" element={<Categories />} />
        <Route path="roles" element={<Roles />} />
        <Route path="attributes" element={<Attributes />} />
        <Route path="admin/orders" element={<AdminOrdersPage />} />
        <Route path="admin/orders/:id" element={<AdminOrderDetailsPage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
