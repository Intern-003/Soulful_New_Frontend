import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import { ArrowLeft, Calendar, Users, ShoppingBag, TrendingUp, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const CouponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useGet(`/vendor/coupons/${id}`);
  const [copied, setCopied] = useState(false);

  const coupon = data?.data;

  const copyToClipboard = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success("Coupon code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    if (!coupon) return null;
    const now = new Date();
    const expiryDate = new Date(coupon.expiry_date);
    const startDate = new Date(coupon.start_date);

    if (!coupon.status) return { text: "Inactive", color: "bg-gray-100 text-gray-700", icon: "🔴" };
    if (expiryDate < now) return { text: "Expired", color: "bg-red-100 text-red-700", icon: "⚠️" };
    if (startDate > now) return { text: "Scheduled", color: "bg-yellow-100 text-yellow-700", icon: "📅" };
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { text: "Used Up", color: "bg-orange-100 text-orange-700", icon: "🏁" };
    }
    return { text: "Active", color: "bg-green-100 text-green-700", icon: "✅" };
  };

  const getFundingBadge = () => {
    if (!coupon) return null;
    const config = {
      admin: { text: "Admin Funded", color: "bg-blue-100 text-blue-700", icon: "👑" },
      vendor: { text: "Vendor Funded", color: "bg-purple-100 text-purple-700", icon: "🏪" },
      shared: { text: "Shared", color: "bg-indigo-100 text-indigo-700", icon: "🤝" }
    };
    return config[coupon.funded_by] || config.vendor;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d]"></div>
    </div>
  );

  if (!coupon) return (
    <div className="p-6 text-center text-red-500">Coupon not found</div>
  );

  const statusBadge = getStatusBadge();
  const fundingBadge = getFundingBadge();

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[#7a1c3d]">Coupon Details</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/dashboard/coupons/edit/${coupon.id}`} className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition">
            Edit Coupon
          </Link>
          <button onClick={() => navigate("/dashboard/coupons")} className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            Back to List
          </button>
        </div>
      </div>

      {/* Coupon Code Card */}
      <div className="bg-gradient-to-r from-[#7a1c3d] to-[#9b2c4f] rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm opacity-80">Coupon Code</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-3xl sm:text-4xl font-mono font-bold tracking-wider">{coupon.code}</p>
              <button onClick={copyToClipboard} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Discount</p>
            <p className="text-3xl font-bold">
              {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><ShoppingBag size={20} className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Usage Count</p>
              <p className="text-2xl font-bold">{coupon.used_count || 0} / {coupon.usage_limit || '∞'}</p>
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
            <div className="p-2 bg-green-100 rounded-lg"><TrendingUp size={20} className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Savings</p>
              <p className="text-2xl font-bold text-green-600">₹{(coupon.total_savings || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Users size={20} className="text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Unique Users</p>
              <p className="text-2xl font-bold">{coupon.unique_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><Calendar size={20} className="text-orange-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${statusBadge?.color}`}>
                {statusBadge?.icon} {statusBadge?.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coupon Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Coupon Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Discount Type</span>
              <span className="font-medium capitalize">{coupon.type} {coupon.type === 'percent' ? '(%)' : '(₹)'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Discount Value</span>
              <span className="font-medium">{coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}</span>
            </div>
            {coupon.min_order_amount > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Minimum Order</span>
                <span className="font-medium">₹{coupon.min_order_amount}</span>
              </div>
            )}
            {coupon.max_discount > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Maximum Discount</span>
                <span className="font-medium">₹{coupon.max_discount}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Funding</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${fundingBadge?.color}`}>
                {fundingBadge?.icon} {fundingBadge?.text}
              </span>
            </div>

            {coupon.funded_by === 'shared' && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-indigo-800 mb-2">💰 Funding Split</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-700">Vendor Share:</span>
                    <span className="font-medium">{coupon.vendor_share_percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-700">Platform Share:</span>
                    <span className="font-medium">{coupon.admin_share_percentage}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${coupon.vendor_share_percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-indigo-600 text-center mt-1">
                    For every ₹{coupon.value} discount, vendor pays ₹{((coupon.value * coupon.vendor_share_percentage) / 100).toFixed(2)} and platform pays ₹{((coupon.value * coupon.admin_share_percentage) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validity Period & Customer Listing */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Validity Period</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Start Date</span>
              <span className="font-medium">{formatDate(coupon.start_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Expiry Date</span>
              <span className="font-medium">{formatDate(coupon.expiry_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Days Remaining</span>
              <span className="font-medium">
                {Math.ceil((new Date(coupon.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Created At</span>
              <span className="font-medium">{formatDate(coupon.created_at)}</span>
            </div>
            {/* ✅ Customer Listing - Now properly inside the card */}
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Customer Listing</span>
              <span className="font-medium">
                {coupon.show_on_listing !== false ? (
                  <span className="text-green-600">✓ Visible to customers</span>
                ) : (
                  <span className="text-orange-600">⊙ Hidden (code only)</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage History */}
      {coupon.usages && coupon.usages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Usage History</h2>
            <p className="text-sm text-gray-500">Last 10 usages</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Order #</th>
                  <th className="p-3 text-right">Discount Amount</th>
                  <th className="p-3 text-left">Date Used</th>
                </tr>
              </thead>
              <tbody>
                {coupon.usages.map((usage) => (
                  <tr key={usage.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{usage.user?.name || 'Guest'}</td>
                    <td className="p-3">#{usage.order?.order_number}</td>
                    <td className="p-3 text-right text-green-600">₹{usage.discount_amount}</td>
                    <td className="p-3 text-gray-500">{new Date(usage.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Usage Message */}
      {(!coupon.usages || coupon.usages.length === 0) && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No usage records yet</p>
          <p className="text-sm text-gray-400 mt-1">This coupon hasn't been used by any customer</p>
        </div>
      )}
    </div>
  );
};

export default CouponDetails;