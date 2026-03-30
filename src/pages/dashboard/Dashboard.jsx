import StatCard from "../../components/dashboard/StatCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard title="Total Sales" value="₹1,20,000" />
        <StatCard title="Orders" value="320" />
        <StatCard title="Products" value="85" />
        <StatCard title="Users" value="150" />

      </div>

    </div>
  );
};

export default Dashboard;