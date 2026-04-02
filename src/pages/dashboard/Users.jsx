import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";

import UserTable from "../../components/dashboard/users/UserTable";

const Users = () => {
  const { data, loading, refetch } = useGet("/admin/users-with-roles");
  const { data: roleData } = useGet("/admin/roles");

  const { postData } = usePost();

  const users = data || [];
  const roles = roleData || [];

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

  // 🔥 Toggle Status (TEMP FRONTEND)
  const handleStatusToggle = (user) => {
    alert("Backend API required for status update");
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Users Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage users, roles and access
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border">

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <UserTable
            users={users}
            roles={roles}
            onRoleChange={handleRoleChange}
            onToggleStatus={handleStatusToggle}
          />
        )}
      </div>
        <tbody>
  {users.map((user) => (
    <UserRow
      key={user.id}
      user={user}
      roles={roles}
      onRefresh={refetch}
    />
  ))}
</tbody>
    </div>
  );
};

export default Users;