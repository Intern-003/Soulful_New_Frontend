import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <DashboardHeader />

        {/* PAGE CONTENT */}
        <main className="p-6 bg-gray-100 flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;