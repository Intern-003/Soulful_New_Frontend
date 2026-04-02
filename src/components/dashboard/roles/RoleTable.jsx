const RoleTable = ({ roles, onEdit, onDelete }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="p-3 text-left">Role Name</th>
          <th className="p-3 text-center">Permissions</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {roles.map((role) => (
          <tr key={role.id} className="border-b hover:bg-gray-50">

            {/* NAME */}
            <td className="p-3 font-semibold">{role.name}</td>

            {/* PERMISSIONS COUNT */}
            <td className="text-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {role.permissions?.length || 0} permissions
              </span>
            </td>

            {/* ACTIONS */}
            <td className="text-center space-x-2">
              <button
                onClick={() => onEdit(role)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(role.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
              >
                Delete
              </button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoleTable;