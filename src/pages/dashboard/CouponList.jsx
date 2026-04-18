// pages/dashboard/coupons/CouponsList.jsx
import { Link,useLocation } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";
import { useEffect } from "react";

const CouponsList = () => {
  const { data, loading, refetch } = useGet("/vendor/coupons");
  const { deleteData } = useDelete();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.refresh) {
      refetch({ force: true });
    }
  }, [location.state])

  const coupons = data?.data || [];

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;

    await deleteData({
      url: `/vendor/coupons/${id}`,
    });

    refetch({ force: true });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Coupons</h2>
        <Link
          to="/dashboard/coupons/create"
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg"
        >
          + Create
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-semibold">{c.code}</td>
                <td>{c.type}</td>
                <td>{c.value}</td>
                <td>{c.used_count}/{c.usage_limit || "∞"}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    c.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {c.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="flex gap-2 p-2">
                  <Link
                    to={`/dashboard/coupons/edit/${c.id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponsList;