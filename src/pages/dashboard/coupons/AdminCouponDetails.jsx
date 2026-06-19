import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import { ArrowLeft, Calendar, Users, ShoppingBag, TrendingUp, PieChart } from "lucide-react";

const AdminCouponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useGet(`/admin/coupons/${id}`);
  
  const couponData = data?.data;
  const coupon = couponData?.coupon;
  const stats = couponData?.statistics;

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a1c3d] mx-auto"></div></div>;
  if (!coupon) return <div className="p-6 text-center text-red-500">Coupon not found</div>;

  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const expiryDate = new Date(coupon.expiry_date);
    
    if (!coupon.status) return { text: "Inactive", color: "bg-gray-100 text-gray-700" };
    if (expiryDate < now) return { text: "Expired", color: "bg-red-100 text-red-700" };
    if (startDate > now) return { text: "Scheduled", color: "bg-yellow-100 text-yellow-700" };
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { text: "Used Up", color: "bg-orange-100 text-orange-700" };
    }
    return { text: "Active", color: "bg-green-100 text-green-700" };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-[#7a1c3d]">Coupon Details: {coupon.code}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Coupon Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Code</p><p className="font-semibold">{coupon.code}</p></div>
            <div><p className="text-sm text-gray-500">Type</p><p className="capitalize">{coupon.type}</p></div>
            <div><p className="text-sm text-gray-500">Value</p><p className="font-semibold">{coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}</p></div>
            <div><p className="text-sm text-gray-500">Min Order</p><p>{coupon.min_order_amount ? `₹${coupon.min_order_amount}` : 'No minimum'}</p></div>
            <div><p className="text-sm text-gray-500">Max Discount</p><p>{coupon.max_discount ? `₹${coupon.max_discount}` : 'No limit'}</p></div>
            <div><p className="text-sm text-gray-500">Funded By</p>
              <p className="capitalize">
                {coupon.funded_by === 'admin' ? 'Admin Funded' : coupon.funded_by === 'vendor' ? 'Vendor Funded' : 'Shared'}
              </p>
            </div>
            {coupon.funded_by === 'shared' && (
              <>
                <div><p className="text-sm text-gray-500">Vendor Share</p><p className="font-medium">{coupon.vendor_share_percentage}%</p></div>
                <div><p className="text-sm text-gray-500">Admin Share</p><p className="font-medium">{coupon.admin_share_percentage}%</p></div>
              </>
            )}
            <div><p className="text-sm text-gray-500">Vendor</p><p>{coupon.vendor?.store_name || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs ${statusBadge.color}`}>{statusBadge.text}</span></div>
            {/* ✅ Added Customer Listing */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Customer Listing</p>
              <p className="font-medium">
                {coupon.show_on_listing !== false ? (
                  <span className="text-green-600">✓ Visible to customers</span>
                ) : (
                  <span className="text-orange-600">⊙ Hidden (code only)</span>
                )}
              </p>
            </div>
          </div>

          {/* Split Visualization for Shared Coupons */}
          {coupon.funded_by === 'shared' && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <PieChart size={18} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-indigo-800">Funding Split</h3>
              </div>
              <div className="flex h-8 rounded-lg overflow-hidden mb-3">
                <div 
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${coupon.vendor_share_percentage}%` }}
                >
                  {coupon.vendor_share_percentage > 15 && `${coupon.vendor_share_percentage}%`}
                </div>
                <div 
                  className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${coupon.admin_share_percentage}%` }}
                >
                  {coupon.admin_share_percentage > 15 && `${coupon.admin_share_percentage}%`}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Vendor: {coupon.vendor_share_percentage}%</span>
                <span className="text-blue-700">Platform: {coupon.admin_share_percentage}%</span>
              </div>
              <p className="text-xs text-indigo-600 mt-2">
                For every ₹{coupon.value} discount, vendor pays ₹{((coupon.value * coupon.vendor_share_percentage) / 100).toFixed(2)} and platform pays ₹{((coupon.value * coupon.admin_share_percentage) / 100).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Usage</p>
                <p className="text-2xl font-bold">{stats?.total_usage || 0}</p>
                {coupon.usage_limit && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, (coupon.used_count / coupon.usage_limit) * 100)}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Total Savings</p>
                <p className="text-2xl font-bold text-green-600">₹{(stats?.total_savings || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <Users className="text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Unique Users</p>
                <p className="text-2xl font-bold">{stats?.unique_users || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Validity</p>
                <p className="text-sm">{new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.expiry_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="text-lg font-semibold">Usage History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Order #</th>
                <th className="p-3 text-right">Discount</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {coupon.usages?.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No usage records</td></tr>
              ) : (
                coupon.usages?.map(usage => (
                  <tr key={usage.id} className="border-t">
                    <td className="p-3">{usage.user?.name || 'Guest'}</td>
                    <td className="p-3">#{usage.order?.order_number}</td>
                    <td className="p-3 text-right text-green-600">₹{usage.discount_amount}</td>
                    <td className="p-3 text-gray-500">{new Date(usage.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to={`/dashboard/admin/coupons/edit/${coupon.id}`} className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg">Edit Coupon</Link>
        <button onClick={() => navigate("/dashboard/admin/coupons")} className="border px-4 py-2 rounded-lg">Back to List</button>
      </div>
    </div>
  );
};

export default AdminCouponDetails;