const UserTable = ({ users, roles, onRoleChange, onToggleStatus }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-center">Role</th>
          <th className="p-3 text-center">Status</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-gray-50">

            {/* NAME */}
            <td className="p-3 font-medium text-gray-800">
              {user.name}
            </td>

            {/* EMAIL */}
            <td className="p-3 text-gray-600">
              {user.email}
            </td>

            {/* ROLE */}
            <td className="p-3 text-center">
              <select
                value={user.role_id}
                onChange={(e) =>
                  onRoleChange(user.id, e.target.value)
                }
                className="border px-2 py-1 rounded"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </td>

            {/* STATUS */}
            <td className="p-3 text-center">
              <button
                onClick={() => onToggleStatus(user)}
                className={`px-3 py-1 text-xs rounded ${
                  user.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status ? "Active" : "Inactive"}
              </button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;