import { useNavigate } from "react-router-dom";
import usePost from "../../../api/hooks/usePost";
import CouponForm from "../../../components/dashboard/coupons/CouponForm";
import toast from "react-hot-toast";

const CreateCoupon = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost();

  const handleSubmit = async (form) => {
    try {
      // Prepare data for API
      const payload = {
        code: form.code,
        type: form.type,
        value: parseFloat(form.value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        start_date: form.start_date,
        expiry_date: form.expiry_date,
        status: form.status === true || form.status === 1 || form.status === "1",
        funded_by: form.funded_by,
        show_on_listing: form.show_on_listing !== false, // ✅ ADD THIS
      };

      // Add split percentages for shared coupons
      if (form.funded_by === "shared") {
        payload.vendor_share_percentage = parseFloat(form.vendor_share_percentage) || 50;
        payload.admin_share_percentage = parseFloat(form.admin_share_percentage) || 50;
      }

      await postData({
        url: "/vendor/coupons",
        data: payload,
      });
      
      toast.success("Coupon created successfully");
      navigate("/dashboard/coupons", { state: { refresh: true } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-[#7a1c3d] mb-4">Create New Coupon</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <CouponForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateCoupon;