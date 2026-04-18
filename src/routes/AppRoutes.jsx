import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/common/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Attributes from "../pages/dashboard/Attributes";
import About from "../pages/public/About";
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
import Checkout from "../pages/user/Checkout";
import AccountPage from "../pages/account/AccountPage";
import Sidebar from "../components/account/Sidebar";
import Orders from "../components/account/sections/Orders";

import Roles from "../pages/dashboard/Roles";
import ShopPage from "../pages/public/ShopPage";
import CategoryPage from "../pages/public/categorypage";
import FreshArrivals from "../pages/public/FreshArrivals";
import Bestsellers from "../pages/public/Bestsellers";
import ProductDetails from "../pages/public/ProductDetails";
import Wishlist from "../pages/public/Wishlist";
import Contact from "../pages/public/Contact";
import Support from "../pages/public/Support";
import VendorOrdersPage from "../pages/dashboard/VendorOrdersPage";
import VendorOrderDetailsPage from "../pages/dashboard/VendorOrderDetailsPage";
import AdminOrderDetailsPage from "../pages/dashboard/AdminOrderDetailsPage";
import AdminOrdersPage from "../pages/dashboard/AdminOrdersPage";
import Permissions from "../pages/dashboard/Permissions";
import SubCategoryProducts from "../pages/dashboard/categories/SubCategoryProducts";
import SubCategoryPage from "../pages/dashboard/categories/SubCategoryPage";
import Brands from "../pages/dashboard/brands";
import Banner from "../pages/dashboard/Banner";
import SupportAdmin from "../pages/dashboard/SupportAdmin";
import Vendors from "../pages/dashboard/Vendors";
import BecomeVendor from "../pages/public/BecomeVendor";
import { Toaster } from "react-hot-toast";

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN WEBSITE */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/fresharrivals" element={<FreshArrivals />} />
          <Route path="/bestsellers" element={<Bestsellers />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/BecomeVendor" element={<BecomeVendor />} />
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
          <Route path="support" element={<SupportAdmin />} />
          <Route path="vendors" element={<Vendors />} />

          <Route
            path="subcategories/:id/products"
            element={<SubCategoryProducts />}
          />
          <Route path="categories/:id" element={<SubCategoryPage />} />
          <Route path="permissions" element={<Permissions />} />
                    <Route path="banners" element={<Banner />} />
          <Route path="brands" element={<Brands />} />
        </Route>

      
        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

   </Routes>
    </>
  );

};

export default AppRoutes;
