import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const { data, loading, refetch } = useGet("/admin/users-with-roles");
  const { data: roleData } = useGet("/admin/roles");
  const { postData } = usePost();

  const users = data || [];
  const roles = roleData || [];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 🔥 Assign Role
  const handleRoleChange = async (userId, roleId) => {
    try {
      await postData({
        url: `/admin/users/${userId}/assign-role`,
        data: { role_id: Number(roleId) },
      });
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  // 🔍 Filter
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Users Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage users, roles and access
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={user.role_id}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d]"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}

                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-400"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages || 1}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;