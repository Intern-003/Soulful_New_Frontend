// src/components/dashboard/DashboardHeader.jsx
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white px-6 py-3 shadow flex justify-between">
      <h1 className="font-semibold">Dashboard</h1>
      <span>{user?.role}</span>
    </div>
  );
};

export default DashboardHeader;