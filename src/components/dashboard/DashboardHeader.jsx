// src/components/dashboard/DashboardHeader.jsx
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === '/dashboard') return 'Admin Dashboard';
    if (location.pathname === '/dashboard/vendor/dashboard') return 'Vendor Dashboard';
    return 'Dashboard';
  };

  return (
    <div className="bg-white px-6 py-3 shadow flex justify-between items-center">
      <h1 className="font-semibold text-gray-800">{getTitle()}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Welcome,</span>
        <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
        <span className="text-xs bg-[#7b183f]/10 text-[#7b183f] px-2 py-1 rounded-full capitalize">
          {user?.role || 'Guest'}
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;