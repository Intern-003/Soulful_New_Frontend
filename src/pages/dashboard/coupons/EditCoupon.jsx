import { useParams, useNavigate } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";
import CouponForm from "../../../components/dashboard/coupons/CouponForm";
import toast from "react-hot-toast";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet(`/vendor/coupons/${id}`);
  const { putData, loading: putLoading } = usePut();

  const coupon = data?.data;

  const handleSubmit = async (form) => {
    try {
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
        show_on_listing: form.show_on_listing !== false, // ✅ ADD THIS
      };

      // Add split percentages for shared coupons if coupon hasn't been used
      if (form.funded_by === "shared" && coupon?.used_count === 0) {
        payload.vendor_share_percentage = parseFloat(form.vendor_share_percentage) || 50;
        payload.admin_share_percentage = parseFloat(form.admin_share_percentage) || 50;
      }

      // If funded_by changed and coupon not used, include it
      if (form.funded_by !== coupon?.funded_by && coupon?.used_count === 0) {
        payload.funded_by = form.funded_by;
        
        // If changing to vendor funded, need vendor_id
        if (form.funded_by === "vendor" && form.vendor_id) {
          payload.vendor_id = form.vendor_id;
        }
        
        // If changing to shared, need split percentages
        if (form.funded_by === "shared") {
          payload.vendor_share_percentage = parseFloat(form.vendor_share_percentage) || 50;
          payload.admin_share_percentage = parseFloat(form.admin_share_percentage) || 50;
        }
      }

      await putData({
        url: `/vendor/coupons/${id}`,
        data: payload,
      });
      
      toast.success("Coupon updated successfully");
      navigate("/dashboard/coupons", { state: { refresh: true } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update coupon");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a1c3d]"></div>
    </div>
  );

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-[#7a1c3d] mb-4">Edit Coupon</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <CouponForm initialData={coupon} onSubmit={handleSubmit} loading={putLoading} />
      </div>
    </div>
  );
};

export default EditCoupon;