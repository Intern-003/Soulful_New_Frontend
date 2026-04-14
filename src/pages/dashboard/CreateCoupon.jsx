// pages/dashboard/coupons/CreateCoupon.jsx
import CouponForm from "../../components/dashboard/coupons/CouponForm";
import usePost from "../../api/hooks/usePost";
import { useNavigate } from "react-router-dom";

const CreateCoupon = () => {
  const { postData, loading } = usePost("/vendor/coupons");
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    await postData(form);
    navigate("/dashboard/coupons", { state: { refresh: true } });
    //navigate("/dashboard/coupons");
  };

  return (
    <div className="p-4 max-w-xl">
      <h2 className="text-xl font-bold mb-4">Create Coupon</h2>
      <CouponForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateCoupon;