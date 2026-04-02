const CategoryTable = ({ data, onEdit, onDelete }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-center">Type</th>
          <th className="p-3 text-center">Status</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((cat) => (
          <>
            {/* PARENT */}
            <tr key={cat.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-800">
                {cat.name}
              </td>

              <td className="text-center">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  Parent
                </span>
              </td>

              <td className="text-center">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  Active
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

            {/* SUBCATEGORIES */}
            {cat.children?.length > 0 ? (
              cat.children.map((sub) => (
                <tr
                  key={sub.id}
                  className="bg-gray-50 border-b hover:bg-gray-100"
                >
                  <td className="p-3 pl-10 text-gray-700">
                    ↳ {sub.name}
                  </td>

                  <td className="text-center">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      Sub
                    </span>
                  </td>

                  <td className="text-center">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Active
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
              ))
            ) : (
              <tr className="bg-gray-50">
                <td colSpan="4" className="text-center text-gray-400 py-2">
                  No subcategories
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;