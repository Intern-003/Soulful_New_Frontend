// pages/dashboard/coupons/EditCoupon.jsx
import { useParams, useNavigate } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import usePut from "../../api/hooks/usePut";
import CouponForm from "../../components/dashboard/coupons/CouponForm";


const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet(`/vendor/coupons/${id}`);
  const { putData } = usePut();

  const coupon = data?.data;

  const handleSubmit = async (form) => {

    await putData({
      url: `/vendor/coupons/${id}`,
      data: {
        ...form,
        status: form.status === true || form.status === 1 || form.status === "1",
      },
    });
    navigate("/dashboard/coupons", { state: { refresh: true } });
    //navigate("/dashboard/coupons");
   
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-xl">
      <h2 className="text-xl font-bold mb-4">Edit Coupon</h2>
      <CouponForm initialData={coupon} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditCoupon;