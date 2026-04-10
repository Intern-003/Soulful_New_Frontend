import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* HEADER */}
        <div className="sticky top-0 z-30">
          <DashboardHeader />
        </div>

        {/* PAGE CONTENT */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;