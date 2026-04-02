import usePut from "../../api/hooks/usePut";
import usePost from "../../api/hooks/usePost";

const UserRow = ({ user, roles, onRefresh }) => {
  const { putData } = usePut();
  const { postData } = usePost();

  // 🔹 Toggle Active/Inactive
  const toggleStatus = async () => {
    try {
      await putData({
        url: `/admin/users/${user.id}`,
        data: {
          status: !user.status,
        },
      });

      onRefresh();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  // 🔹 Change Role
  const handleRoleChange = async (roleId) => {
    try {
      await postData({
        url: `/admin/users/${user.id}/assign-role`,
        data: {
          role_id: roleId,
        },
      });

      onRefresh();
    } catch (err) {
      console.error("Role assign failed", err);
    }
  };

  return (
    <tr className="border-b">

      {/* NAME */}
      <td className="p-3 font-medium">{user.name}</td>

      {/* EMAIL */}
      <td className="p-3 text-gray-600">{user.email}</td>

      {/* ROLE DROPDOWN */}
      <td className="p-3">
        <select
          value={user.role?.id || ""}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </td>

      {/* STATUS TOGGLE */}
      <td className="p-3">
        <button
          onClick={toggleStatus}
          className={`px-3 py-1 rounded text-white text-xs ${
            user.status ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {user.status ? "Active" : "Inactive"}
        </button>
      </td>

    </tr>
  );
};

export default UserRow;