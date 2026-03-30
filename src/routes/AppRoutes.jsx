import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
import Home from "../pages/public/Home";

// Layout
import MainLayout from "../components/common/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>

      PUBLIC (NO LAYOUT)
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/register" element={<Register />} /> */}

      {/* PUBLIC WITH LAYOUT (HOME) */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>
  );
};

export default AppRoutes;