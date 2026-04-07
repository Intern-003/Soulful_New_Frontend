const CategoryTable = ({ data, onEdit, onDelete }) => {
  return (
    <table className="w-full text-sm border rounded overflow-hidden">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-center">Type</th>
          <th className="p-3 text-center">Position</th>
          <th className="p-3 text-center">Status</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((cat) => (
          <tbody key={cat.id}>
            {/* ✅ PARENT */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3 flex items-center gap-3">
                <img
                  src={`http://127.0.0.1:8000/storage/${cat.image}`}
                  alt=""
                  className="h-10 w-10 object-cover rounded"
                />
                <span className="font-semibold">{cat.name}</span>
              </td>

              <td className="text-center">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  Parent
                </span>
              </td>

              <td className="text-center">
                {cat.position ?? "-"}
              </td>

              <td className="text-center">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    cat.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {cat.status ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="text-center space-x-2">
                <button
                  onClick={() => onEdit(cat)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(cat)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>

            {/* ✅ SUBCATEGORIES */}
            {cat.children?.map((sub) => (
              <tr
                key={sub.id}
                className="bg-gray-50 border-b hover:bg-gray-100"
              >
                <td className="p-3 pl-10 flex items-center gap-3">
                  <img
                    src={`http://127.0.0.1:8000/storage/${sub.image}`}
                    alt=""
                    className="h-8 w-8 object-cover rounded"
                  />
                  <span>↳ {sub.name}</span>
                </td>

                <td className="text-center">
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Sub
                  </span>
                </td>

                <td className="text-center">
                  {sub.position ?? "-"}
                </td>

                <td className="text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      sub.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {sub.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="text-center space-x-2">
                  <button
                    onClick={() => onEdit(sub)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(sub)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;