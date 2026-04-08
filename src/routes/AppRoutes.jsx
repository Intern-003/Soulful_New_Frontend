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
import Orders from "../pages/dashboard/Orders";
import Users from "../pages/dashboard/Users";
import Categories from "../pages/dashboard/categories";
import SubCategoryProducts from "../pages/dashboard/categories/SubCategoryProducts";
import SubCategoryPage from "../pages/dashboard/categories/SubCategoryPage";
import Cart from "../pages/user/Cart";
import Roles from "../pages/dashboard/Roles";
import ShopPage from "../pages/public/ShopPage";
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
      </Route>

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="categories" element={<Categories />} />
        <Route path="roles" element={<Roles />} />
        <Route path="attributes" element={<Attributes />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
  path="/dashboard/subcategories/:id/products"
  element={<SubCategoryProducts />}
/>
  <Route
        path="/dashboard/categories/:id"
        element={<SubCategoryPage />}
      />
    </Routes>
  );
};

export default AppRoutes;