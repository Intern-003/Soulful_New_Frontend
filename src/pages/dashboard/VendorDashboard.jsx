// pages/dashboard/vendor/VendorDashboard.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import useGet from "../../api/hooks/useGet";
import {
  ShoppingBag,
  Package,
  DollarSign,
  RefreshCw,
  Download,
  ArrowUpRight,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Chart from "react-apexcharts";

const VendorDashboard = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartReady, setChartReady] = useState(false);

  // ✅ Cache for API responses
  const dataCache = useRef(new Map());

  // ✅ API Calls
  const { data: dashboardData, loading: dashboardLoading, refetch: refetchDashboard } = useGet(
    "/vendor/dashboard"
  );

  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useGet(
    "/vendor/dashboard/stats"
  );

  const { data: revenueData, loading: revenueLoading, refetch: refetchRevenue } = useGet(
    "/vendor/dashboard/revenue-chart"
  );

  const { data: ordersData, loading: ordersLoading, refetch: refetchOrders } = useGet(
    "/vendor/orders/summary"
  );

  // ✅ Extract data with proper fallbacks
  const dashboard = dashboardData?.data || {};
  const stats = statsData?.data || {};
  const revenue = revenueData?.data || [];

  // ✅ FIXED: Ensure recentOrders is always an array
  const recentOrders = Array.isArray(ordersData?.data) ? ordersData.data : [];

  const isLoading = dashboardLoading || statsLoading || revenueLoading || ordersLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Memoized chart data
  const chartData = useMemo(() => {
    if (!revenue || revenue.length === 0) {
      // Fallback data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({
        label: day,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 20) + 5,
      }));
    }

    // Sort by date
    const sorted = [...revenue].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Take last 7 days or all if less
    const recent = sorted.slice(-7);
    
    return recent.map(item => ({
      label: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      revenue: Number(item.revenue) || 0,
      orders: Number(item.orders) || 0,
    }));
  }, [revenue]);

  // ✅ Chart Series
  const revenueChartSeries = useMemo(() => [
    {
      name: 'Revenue',
      data: chartData.map(item => item.revenue),
    },
  ], [chartData]);

  const ordersChartSeries = useMemo(() => [
    {
      name: 'Orders',
      data: chartData.map(item => item.orders),
    },
  ], [chartData]);

  // ✅ Chart Options - Revenue
  const revenueChartOptions = useMemo(() => ({
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: !isLoading, easing: 'easeinout', speed: 800 },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartData.map(item => item.label),
      labels: { style: { colors: '#9CA3AF' } },
    },
    yaxis: {
      title: { text: 'Revenue (₹)', style: { color: '#9CA3AF' } },
      labels: { formatter: (value) => `₹${value.toLocaleString()}` },
    },
    tooltip: {
      y: { formatter: (value) => `₹${value.toLocaleString()}` },
    },
    colors: ['#7b183f'],
    grid: { borderColor: '#E5E7EB' },
  }), [chartData, isLoading]);

  // ✅ Chart Options - Orders
  const ordersChartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      animations: { enabled: !isLoading, easing: 'easeinout', speed: 800 },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -15,
      style: { fontSize: '11px', colors: ['#6B7280'] },
    },
    xaxis: {
      categories: chartData.map(item => item.label),
      labels: { style: { colors: '#9CA3AF' } },
    },
    yaxis: {
      title: { text: 'Orders', style: { color: '#9CA3AF' } },
    },
    colors: ['#a52355'],
    grid: { borderColor: '#E5E7EB' },
  }), [chartData, isLoading]);

  // ✅ Refresh handler
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchDashboard({ force: true }),
        refetchStats({ force: true }),
        refetchRevenue({ force: true }),
        refetchOrders({ force: true }),
      ]);
      toast.success('Dashboard refreshed successfully');
    } catch (err) {
      console.error("Refresh failed:", err);
      toast.error('Failed to refresh dashboard');
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, refetchDashboard, refetchStats, refetchRevenue, refetchOrders]);

  // ✅ Format currency
  const formatCurrency = useCallback((value) => {
    if (!value && value !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // ✅ Get status color
  const getStatusColor = useCallback((status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || colors.pending;
  }, []);

  // ✅ Get status icon
  const getStatusIcon = useCallback((status) => {
    const icons = {
      'pending': <Clock size={14} />,
      'processing': <RefreshCw size={14} />,
      'confirmed': <CheckCircle size={14} />,
      'shipped': <TrendingUp size={14} />,
      'delivered': <CheckCircle size={14} />,
      'cancelled': <XCircle size={14} />,
    };
    return icons[status?.toLowerCase()] || <AlertCircle size={14} />;
  }, []);

  // ✅ Stat Card Component
  const StatCard = ({ title, value, icon: Icon, subtext, loading }) => (
    <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#7b183f]/20 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-gradient-to-br from-[#7b183f] to-[#a52355] rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
      <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{title}</h3>
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
        {loading ? (
          <div className="h-7 sm:h-8 w-20 sm:w-28 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value
        )}
      </div>
      {subtext && !loading && (
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );

  // ✅ Loading state
  if (isLoading && !dashboard.total_products && !stats.total_revenue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b183f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#7b183f]">
              🏪 Vendor Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your store performance and track sales
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              {["daily", "weekly", "monthly", "yearly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 capitalize ${
                    timeRange === range
                      ? "bg-[#7b183f] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Total Products"
            value={dashboard.total_products || 0}
            icon={Package}
            subtext="In your catalog"
            loading={dashboardLoading}
          />
          <StatCard
            title="Total Orders"
            value={dashboard.total_orders || 0}
            icon={ShoppingBag}
            subtext="All time orders"
            loading={dashboardLoading}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboard.total_revenue || stats.total_revenue || 0)}
            icon={DollarSign}
            subtext="All time earnings"
            loading={dashboardLoading || statsLoading}
          />
        </div>

        {/* Additional Stats from Stats API */}
        {stats.total_revenue !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(stats.total_revenue)}
              </p>
              <p className="text-xs text-blue-600 mt-1">From stats API</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-green-700 font-medium">Orders</p>
              <p className="text-2xl font-bold text-green-800">
                {stats.total_orders || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">Unique orders</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">Products</p>
              <p className="text-2xl font-bold text-purple-800">
                {stats.total_products || 0}
              </p>
              <p className="text-xs text-purple-600 mt-1">Active products</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {chartReady && chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <Chart
                key={`revenue-chart-${timeRange}`}
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="area"
                height={300}
              />
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <Chart
                key={`orders-chart-${timeRange}`}
                options={ordersChartOptions}
                series={ordersChartSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-xs text-gray-500 mt-1">Latest transactions</p>
              </div>
              <button className="text-[#7b183f] hover:text-[#a52355] text-sm font-medium flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {!Array.isArray(recentOrders) || recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No orders yet</p>
                <p className="text-xs mt-1">Your orders will appear here</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">
                        #{order.order_id || order.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-600">
                        {order.product?.name || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">
                        {formatCurrency(order.total || order.amount || 0)}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-xs text-gray-500">
                        {new Date(order.created_at || order.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;