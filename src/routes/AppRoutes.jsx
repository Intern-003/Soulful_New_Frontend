// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
//import ForgotPassword from "../pages/auth/ForgotPassword";
//import Home from "../pages/public/Home";

// Components
import PrivateRoute from "../components/common/PrivateRoute";

// Redux
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      {/* <Route path="/" element={<Home />} /> */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />
      {/* <Route
        path="/forgot-password"
        element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />}
      /> */}

      {/* Protected user routes example */}
      {/* Replace with Profile page later */}
      {/* <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Home /> 
          </PrivateRoute>
        }
      /> */}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;