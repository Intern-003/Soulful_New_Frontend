import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../../../api/hooks/usePost";
import useGet from "../../../api/hooks/useGet";
import toast from "react-hot-toast";

const AdminCreateCoupon = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost();
  const { data: vendorsData } = useGet("/admin/vendors");
  const vendors = vendorsData?.data || [];

  const [form, setForm] = useState({
    code: "",
    type: "fixed",
    value: "",
    min_order_amount: "",
    max_discount: "",
    usage_limit: "",
    start_date: "",
    expiry_date: "",
    funded_by: "admin",
    vendor_id: "",
    vendor_share_percentage: "",
    admin_share_percentage: "",
    applies_to: "all",
    show_on_listing: true,
  });

  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    if (form.funded_by === "shared") {
      const vendorShare = parseFloat(form.vendor_share_percentage) || 0;
      const adminShare = parseFloat(form.admin_share_percentage) || 0;
      setTotalPercentage(vendorShare + adminShare);
    } else {
      setTotalPercentage(100);
    }
  }, [form.funded_by, form.vendor_share_percentage, form.admin_share_percentage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "funded_by" && value === "shared") {
      setForm(prev => ({
        ...prev,
        funded_by: value,
        vendor_share_percentage: "50",
        admin_share_percentage: "50"
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleVendorShareChange = (e) => {
    const vendorShare = parseFloat(e.target.value) || 0;
    if (vendorShare > 100) return;
    const adminShare = 100 - vendorShare;
    setForm(prev => ({
      ...prev,
      vendor_share_percentage: vendorShare,
      admin_share_percentage: adminShare
    }));
  };

  const handleAdminShareChange = (e) => {
    const adminShare = parseFloat(e.target.value) || 0;
    if (adminShare > 100) return;
    const vendorShare = 100 - adminShare;
    setForm(prev => ({
      ...prev,
      admin_share_percentage: adminShare,
      vendor_share_percentage: vendorShare
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code || !form.type || !form.value || !form.start_date || !form.expiry_date) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.type === "percent" && parseFloat(form.value) > 100) {
      toast.error("Percentage value cannot exceed 100");
      return;
    }

    if (form.funded_by === "shared" && totalPercentage !== 100) {
      toast.error("Vendor and admin shares must total 100%");
      return;
    }

    if (form.funded_by === "vendor" && !form.vendor_id) {
      toast.error("Please select a vendor for vendor-funded coupon");
      return;
    }

    const submitData = {
      code: form.code,
      type: form.type,
      value: parseFloat(form.value),
      min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
      max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      start_date: form.start_date,
      expiry_date: form.expiry_date,
      funded_by: form.funded_by,
      applies_to: form.applies_to,
      show_on_listing: form.show_on_listing !== false,
    };

    if (form.funded_by === "vendor") {
      submitData.vendor_id = form.vendor_id;
    }

    if (form.funded_by === "shared") {
      submitData.vendor_share_percentage = parseFloat(form.vendor_share_percentage);
      submitData.admin_share_percentage = parseFloat(form.admin_share_percentage);
    }

    try {
      await postData({
        url: "/admin/coupons",
        data: submitData
      });
      toast.success("Coupon created successfully");
      navigate("/dashboard/admin/coupons");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#7a1c3d] mb-6">Create New Coupon</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code *</label>
            <input name="code" value={form.code} onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#7a1c3d]" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discount Type *</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="fixed">Fixed Amount (₹)</option>
              <option value="percent">Percentage (%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discount Value *</label>
            <input name="value" type="number" step="0.01" value={form.value} onChange={handleChange}
              className="w-full border rounded-lg p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum Order Amount</label>
            <input name="min_order_amount" type="number" step="0.01" value={form.min_order_amount} onChange={handleChange}
              className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Maximum Discount</label>
            <input name="max_discount" type="number" step="0.01" value={form.max_discount} onChange={handleChange}
              className="w-full border rounded-lg p-2" placeholder="Optional" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Usage Limit</label>
            <input name="usage_limit" type="number" value={form.usage_limit} onChange={handleChange}
              className="w-full border rounded-lg p-2" placeholder="Unlimited if empty" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date *</label>
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
              className="w-full border rounded-lg p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date *</label>
            <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange}
              className="w-full border rounded-lg p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Funded By *</label>
            <select name="funded_by" value={form.funded_by} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="admin">Admin Funded (Platform pays)</option>
              <option value="vendor">Vendor Funded (Vendor pays)</option>
              <option value="shared">Shared (Split between vendor & platform)</option>
            </select>
          </div>

          {form.funded_by === "vendor" && (
            <div>
              <label className="block text-sm font-medium mb-1">Select Vendor *</label>
              <select name="vendor_id" value={form.vendor_id} onChange={handleChange} className="w-full border rounded-lg p-2" required>
                <option value="">Select Vendor</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.store_name}</option>)}
              </select>
            </div>
          )}

          {form.funded_by === "shared" && (
            <>
              <div className="col-span-2 bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Split Percentage (Total must be 100%)</p>

                <div>
                  <label className="block text-sm text-blue-700 mb-1">Vendor Share (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={form.vendor_share_percentage || 50}
                      onChange={handleVendorShareChange}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={form.vendor_share_percentage || 50}
                      onChange={handleVendorShareChange}
                      min="0"
                      max="100"
                      className="w-20 border p-2 rounded text-center"
                    />
                    <span className="text-blue-700">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-blue-700 mb-1">Admin Share (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={form.admin_share_percentage || 50}
                      onChange={handleAdminShareChange}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={form.admin_share_percentage || 50}
                      onChange={handleAdminShareChange}
                      min="0"
                      max="100"
                      className="w-20 border p-2 rounded text-center"
                    />
                    <span className="text-blue-700">%</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-medium">
                  <span className="text-green-600">Vendor: {form.vendor_share_percentage || 50}%</span>
                  <span className="text-blue-600">Platform: {form.admin_share_percentage || 50}%</span>
                  <span className={`${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    Total: {totalPercentage}%
                  </span>
                </div>

                {totalPercentage !== 100 && (
                  <p className="text-red-500 text-xs">Total must be 100%</p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="show_on_listing"
            checked={form.show_on_listing !== false}
            onChange={handleChange}
          />
          <label className="text-sm font-medium">Show in customer listing</label>
        </div>
        <p className="text-xs text-gray-500 ml-6">
          If disabled, coupon won't appear in customer's available coupons list,
          but can still be used by entering the code manually.
        </p>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || (form.funded_by === "shared" && totalPercentage !== 100)}
            className="bg-[#7a1c3d] text-white px-6 py-2 rounded-lg hover:bg-[#5e132f] transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard/admin/coupons")} className="border px-6 py-2 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateCoupon;