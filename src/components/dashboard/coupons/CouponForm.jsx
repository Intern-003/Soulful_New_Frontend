// CouponForm.jsx
import { useState, useEffect } from "react";

const CouponForm = ({ initialData = {}, onSubmit, loading, isAdmin = false }) => {
  const [form, setForm] = useState({
    code: "",
    type: "fixed",
    value: "",
    min_order_amount: "",
    max_discount: "",
    usage_limit: "",
    start_date: "",
    expiry_date: "",
    status: true,
    show_on_listing: true,
    funded_by: "vendor",
    vendor_share_percentage: "",
    admin_share_percentage: "",
    vendor_id: "",
    applies_to: "all",
    category_id: "",
    product_id: "",
    applicable_vendors: []
  });

  const [showSplitFields, setShowSplitFields] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const formatDate = (date) => {
        if (!date) return "";
        return date.split("T")[0];
      };

      setForm((prev) => ({
        ...prev,
        ...initialData,
        start_date: formatDate(initialData.start_date),
        expiry_date: formatDate(initialData.expiry_date),
        status: Boolean(initialData.status),
        funded_by: initialData.funded_by || "vendor",
        vendor_share_percentage: initialData.vendor_share_percentage || "",
        admin_share_percentage: initialData.admin_share_percentage || "",
      }));
      
      setShowSplitFields(initialData.funded_by === "shared");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "funded_by") {
      setShowSplitFields(value === "shared");
      if (value !== "shared") {
        setForm(prev => ({
          ...prev,
          [name]: value,
          vendor_share_percentage: "",
          admin_share_percentage: ""
        }));
        return;
      }
    }
    
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleVendorShareChange = (e) => {
    const vendorShare = parseFloat(e.target.value) || 0;
    if (vendorShare > 100) return;
    const adminShare = 100 - vendorShare;
    setForm({
      ...form,
      vendor_share_percentage: vendorShare,
      admin_share_percentage: adminShare
    });
  };

  const handleAdminShareChange = (e) => {
    const adminShare = parseFloat(e.target.value) || 0;
    if (adminShare > 100) return;
    const vendorShare = 100 - adminShare;
    setForm({
      ...form,
      admin_share_percentage: adminShare,
      vendor_share_percentage: vendorShare
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {/* Coupon Code */}
      <div>
        <label className="block text-sm font-medium mb-1">Coupon Code *</label>
        <input 
          name="code" 
          value={form.code} 
          onChange={handleChange}
          placeholder="e.g., SAVE20" 
          className="w-full border p-2 rounded focus:ring-2 focus:ring-[#7a1c3d]" 
          required 
        />
      </div>

      {/* Discount Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Discount Type *</label>
        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="fixed">Fixed Amount (₹)</option>
          <option value="percent">Percentage (%)</option>
        </select>
      </div>

      {/* Discount Value */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {form.type === 'fixed' ? 'Discount Amount (₹)' : 'Discount Percentage (%)'} *
        </label>
        <input 
          name="value" 
          type="number" 
          step="0.01" 
          value={form.value} 
          onChange={handleChange}
          placeholder={form.type === 'fixed' ? "e.g., 100" : "e.g., 10"} 
          className="w-full border p-2 rounded" 
          required 
        />
        {form.type === 'percent' && form.value > 100 && (
          <p className="text-red-500 text-xs mt-1">Percentage cannot exceed 100%</p>
        )}
      </div>

      {/* Minimum Order Amount */}
      <div>
        <label className="block text-sm font-medium mb-1">Minimum Order Amount (₹)</label>
        <input 
          name="min_order_amount" 
          type="number" 
          step="0.01" 
          value={form.min_order_amount}
          onChange={handleChange} 
          placeholder="Optional" 
          className="w-full border p-2 rounded" 
        />
      </div>

      {/* Maximum Discount */}
      <div>
        <label className="block text-sm font-medium mb-1">Maximum Discount (₹)</label>
        <input 
          name="max_discount" 
          type="number" 
          step="0.01" 
          value={form.max_discount}
          onChange={handleChange} 
          placeholder="Optional - max amount that can be discounted" 
          className="w-full border p-2 rounded" 
        />
      </div>

      {/* Usage Limit */}
      <div>
        <label className="block text-sm font-medium mb-1">Usage Limit</label>
        <input 
          name="usage_limit" 
          type="number" 
          value={form.usage_limit}
          onChange={handleChange} 
          placeholder="Leave empty for unlimited" 
          className="w-full border p-2 rounded" 
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date *</label>
          <input 
            type="date" 
            name="start_date" 
            value={form.start_date}
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date *</label>
          <input 
            type="date" 
            name="expiry_date" 
            value={form.expiry_date}
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
      </div>

      {/* Funding Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Funding Type *</label>
        <select 
          name="funded_by" 
          value={form.funded_by} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
          disabled={!isAdmin && form.funded_by === 'admin'}
        >
          <option value="vendor">Vendor Funded (I pay the discount)</option>
          {isAdmin && <option value="admin">Admin Funded (Platform pays)</option>}
          <option value="shared">Shared (Split between vendor & platform)</option>
        </select>
        {!isAdmin && form.funded_by === 'admin' && (
          <p className="text-xs text-red-500 mt-1">Only admin can create admin-funded coupons</p>
        )}
      </div>

      {/* Dynamic Split Fields for Shared Coupons */}
      {showSplitFields && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
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
                name="vendor_share_percentage"
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
                name="admin_share_percentage"
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
            <span className="text-gray-600">Total: {(form.vendor_share_percentage || 50) + (form.admin_share_percentage || 50)}%</span>
          </div>
          
          {((form.vendor_share_percentage || 50) + (form.admin_share_percentage || 50)) !== 100 && (
            <p className="text-red-500 text-xs">Total must be 100%</p>
          )}
        </div>
      )}

      {/* Active Status */}
      <label className="flex items-center gap-2">
        <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
        <span className="text-sm">Active</span>
      </label>

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
      {/* Read-only funding info for edit mode */}
      {initialData?.funded_by && initialData.funded_by !== 'vendor' && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Funding:</strong> {initialData.funded_by === 'admin' ? 'Admin Funded' : 'Shared Funded'}
          </p>
          {initialData.funded_by === 'shared' && (
            <p className="text-xs text-blue-600 mt-1">
              Vendor Share: {initialData.vendor_share_percentage}% | Admin Share: {initialData.admin_share_percentage}%
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (form.type === 'percent' && form.value > 100) || (showSplitFields && ((form.vendor_share_percentage || 50) + (form.admin_share_percentage || 50)) !== 100)}
        className="bg-[#7a1c3d] text-white px-4 py-2 rounded w-full hover:bg-[#5e132f] transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Coupon"}
      </button>
    </form>
  );
};

export default CouponForm;