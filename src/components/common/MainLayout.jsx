import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">

      <Header />

      <main className="flex-1">
        <Outlet /> {/* ✅ THIS IS REQUIRED */}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;