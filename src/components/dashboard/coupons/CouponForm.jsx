// components/coupons/CouponForm.jsx
import { useState, useEffect } from "react";

const CouponForm = ({ initialData = {}, onSubmit, loading }) => {
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
  });



  useEffect(() => {
  if (initialData && Object.keys(initialData).length > 0) {
    const formatDate = (date) => {
      if (!date) return "";
      return date.split("T")[0]; // ✅ FIX
    };

    setForm((prev) => ({
      ...prev,
      ...initialData,
      start_date: formatDate(initialData.start_date),
      expiry_date: formatDate(initialData.expiry_date),
      status: Boolean(initialData.status),
    }));
  }
}, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,

      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <input name="code" value={form.code} onChange={handleChange}
        placeholder="Code" className="w-full border p-2 rounded" />

      <select name="type" value={form.type} onChange={handleChange}
        className="w-full border p-2 rounded">
        <option value="fixed">Fixed</option>
        <option value="percent">Percent</option>
      </select>

      <input name="value" value={form.value} onChange={handleChange}
        placeholder="Value" className="w-full border p-2 rounded" />

      <input name="min_order_amount" value={form.min_order_amount}
        onChange={handleChange} placeholder="Min Order"
        className="w-full border p-2 rounded" />

      <input name="max_discount" value={form.max_discount}
        onChange={handleChange} placeholder="Max Discount"
        className="w-full border p-2 rounded" />

      <input name="usage_limit" value={form.usage_limit}
        onChange={handleChange} placeholder="Usage Limit"
        className="w-full border p-2 rounded" />

      <input type="date" name="start_date" value={form.start_date}
        onChange={handleChange} className="w-full border p-2 rounded" />

      <input type="date" name="expiry_date" value={form.expiry_date}
        onChange={handleChange} className="w-full border p-2 rounded" />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="status"
          checked={form.status} onChange={handleChange} />
        Active
      </label>

      <button
        disabled={loading}
        className="bg-[#7a1c3d] text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Saving..." : "Save Coupon"}
      </button>
    </form>
  );
};

export default CouponForm;