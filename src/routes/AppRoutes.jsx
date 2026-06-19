import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/common/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Attributes from "../pages/dashboard/Attributes";
import About from "../pages/public/About";
// Pages
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import VendorDashboard from "../pages/dashboard/VendorDashboard";
import Products from "../pages/dashboard/Products";
import Users from "../pages/dashboard/Users";
import Categories from "../pages/dashboard/categories/Categories";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import AccountPage from "../pages/account/AccountPage";
import Roles from "../pages/dashboard/Roles";
import ShopPage from "../pages/public/ShopPage";
import SoulfullSpecialPage from "../pages/public/SoulfullSpecialPage";
import ExclusivePage from "../pages/public/ExclusivePage";
import CategoryPage from "../pages/public/categorypage";
import FreshArrivals from "../pages/public/FreshArrivals";
import Bestsellers from "../pages/public/Bestsellers";
import ProductDetails from "../pages/public/ProductDetails";
import Wishlist from "../pages/user/Wishlist";
import Contact from "../pages/public/Contact";
import TermsPrivacy from "../pages/public/TermsPrivacy";
import ShippingInfo from "../pages/public/ShippingInfo";
import ReturnsExchange from "../pages/public/ReturnsExchange";
import Support from "../pages/public/Support";
import VendorOrdersPage from "../pages/dashboard/orders/VendorOrdersPage";
import VendorOrderDetailsPage from "../pages/dashboard/orders/VendorOrderDetailsPage";
import BrandProductsPage from "../pages/dashboard/brands/BrandProducts";
import AdminOrderDetailsPage from "../pages/dashboard/orders/AdminOrderDetailsPage";
import AdminOrdersPage from "../pages/dashboard/orders/AdminOrdersPage";
import Permissions from "../pages/dashboard/Permissions";
import SubCategoryProducts from "../pages/dashboard/categories/SubCategoryProducts";
import SubCategoryPage from "../pages/dashboard/categories/SubCategoryPage";
import Brands from "../pages/dashboard/brands/brands";
import Banner from "../pages/dashboard/Banner";
import SupportAdmin from "../pages/dashboard/SupportAdmin";
import Vendors from "../pages/dashboard/Vendors";
import BecomeVendor from "../pages/public/BecomeVendor";
import { Toaster } from "react-hot-toast";

// Vendor Coupon Pages
import CouponList from "../pages/dashboard/coupons/CouponList";
import CreateCoupon from "../pages/dashboard/coupons/CreateCoupon";
import EditCoupon from "../pages/dashboard/coupons/EditCoupon";
import CouponDetails from "../pages/dashboard/coupons/CouponDetails";

// Admin Coupon Pages
import AdminCouponsList from "../pages/dashboard/coupons/AdminCouponsList";
import AdminCreateCoupon from "../pages/dashboard/coupons/AdminCreateCoupon";
import AdminCouponDetails from "../pages/dashboard/coupons/AdminCouponDetails";
import AdminEditCoupon from "../pages/dashboard/coupons/AdminEditCoupon";

import BannerLayoutPreview from "../components/dashboard/banners/BannerLayoutPreview";
import VendorEarningsPage from "../pages/dashboard/VendorEarningsPage";
import AdminWithdrawalsPage from "../pages/dashboard/AdminWithdrawalsPage";
import VendorWithdrawalsPage from "../pages/dashboard/VendorWithdrawalsPage";
import OrderComplete from "../pages/user/OrderComplete";

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
          <Route path="/soulful-special" element={<SoulfullSpecialPage />} />
          <Route path="/exclusive" element={<ExclusivePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/fresharrivals" element={<FreshArrivals />} />
          <Route path="/bestsellers" element={<Bestsellers />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:identifier" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/termsprivacy" element={<TermsPrivacy />} />
          <Route path="/shippinginfo" element={<ShippingInfo />} />
          <Route path="/returnsexchange" element={<ReturnsExchange />} />
          <Route path="/support" element={<Support />} />
          <Route path="/BecomeVendor" element={<BecomeVendor />} />
          <Route path="/order-complete" element={<OrderComplete />} />
        </Route>

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vendor/dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<Products />} />
          
          {/* Vendor Orders */}
          <Route path="vendor/orders" element={<VendorOrdersPage />} />
          <Route path="vendor/orders/:id" element={<VendorOrderDetailsPage />} />
          
          {/* Admin Orders */}
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderDetailsPage />} />
          
          {/* Vendor Coupons */}
          <Route path="coupons" element={<CouponList />} />
          <Route path="coupons/create" element={<CreateCoupon />} />
          <Route path="coupons/edit/:id" element={<EditCoupon />} />
          <Route path="coupons/:id" element={<CouponDetails />} />
          
          {/* Admin Coupons */}
          <Route path="admin/coupons" element={<AdminCouponsList />} />
          <Route path="admin/coupons/create" element={<AdminCreateCoupon />} />
          <Route path="admin/coupons/:id" element={<AdminCouponDetails />} />
          <Route path="admin/coupons/edit/:id" element={<AdminEditCoupon />} />
          
          {/* Other Dashboard Routes */}
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="roles" element={<Roles />} />
          <Route path="attributes" element={<Attributes />} />
          <Route path="support" element={<SupportAdmin />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="earnings" element={<VendorEarningsPage />} />
          <Route path="withdrawals" element={<VendorWithdrawalsPage />} />
          // ✅ Admin Withdrawals
<Route path="admin/withdrawals" element={<AdminWithdrawalsPage />} />

// ✅ Admin Earnings (reuses AdminWithdrawalsPage since they show same data)
<Route path="admin/earnings" element={<AdminWithdrawalsPage />} />
          <Route path="subcategories/:id/products" element={<SubCategoryProducts />} />
          <Route path="categories/:id" element={<SubCategoryPage />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="banners" element={<Banner />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/:id/products" element={<BrandProductsPage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;