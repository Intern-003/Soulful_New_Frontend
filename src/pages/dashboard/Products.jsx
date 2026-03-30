import useGet from "../../api/hooks/useGet";

const Products = () => {
  const { data, loading } = useGet("/products");

  const products = data?.data || [];

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
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
              products.map((p) => (
                <tr key={p.id} className="border-t">

                  <td className="p-3">{p.name}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.stock}</td>

                  <td className="p-3 flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded">
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Products;