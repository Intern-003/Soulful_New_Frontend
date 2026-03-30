import useGet from "../../api/hooks/useGet";

const Orders = () => {
  const { data, loading } = useGet("/orders");

  const orders = data?.data || [];

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t">

                  <td className="p-3">#{o.id}</td>
                  <td className="p-3">{o.user?.name}</td>
                  <td className="p-3">₹{o.total}</td>
                  <td className="p-3">{o.status}</td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Orders;