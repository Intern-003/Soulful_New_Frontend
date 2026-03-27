import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/public/Home";

// Layout
import MainLayout from "../components/common/MainLayout";

// Redux
import { useSelector } from "react-redux";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 🔥 TEMP: force login bypass for testing
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/home"
        element={
            <Home />
    
        }
      />

     
      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>
  );
};

export default AppRoutes;