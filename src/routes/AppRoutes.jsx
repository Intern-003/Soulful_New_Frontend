import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/common/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Home from "../pages/public/Home";
// import Login from "../pages/auth/Login";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/dashboard/Products";
import Orders from "../pages/dashboard/Orders";
import Users from "../pages/dashboard/Users";

const AppRoutes = () => {
  return (
    <Routes>

     
      <Route path="/login" element={<Login />} /> 
     <Route path="/register" element={<Register />}/>

      {/* MAIN WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;