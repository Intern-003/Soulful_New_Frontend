import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

/* ==========================================================
   PRODUCTION GRADE DASHBOARD LAYOUT
   ✔ Works with fixed/collapsible sidebar
   ✔ Fully responsive mobile/tablet/desktop
   ✔ Clean spacing
   ✔ No md:ml-64 issue
   ✔ Sticky header
   ✔ Scrollable content area
   ✔ Professional SaaS panel structure
========================================================== */

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={
          setSidebarCollapsed
        }
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <DashboardHeader />
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1700px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;