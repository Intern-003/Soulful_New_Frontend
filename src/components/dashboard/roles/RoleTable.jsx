// ✅ FINAL IMPROVED RBAC SYSTEM (FRONTEND)
// Includes:
// - Fixed API consistency (permission_ids)
// - Better Permission UI (checkbox matrix + select all)
// - Clean Role Form + Table improvements

import React from "react";
const RoleTable = ({ roles, onEdit, onDelete }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-3 text-left">Role</th>
          <th className="p-3">Permissions</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {roles.map((role) => {
          const grouped = {};

          role.permissions?.forEach((p) => {
            if (!grouped[p.module]) grouped[p.module] = 0;
            grouped[p.module]++;
          });

          return (
            <tr key={role.id} className="border-t">
              <td className="p-3 font-semibold">{role.name}</td>

              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {Object.keys(grouped).map((m) => (
                    <span
                      key={m}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {m} ({grouped[m]})
                    </span>
                  ))}
                </div>
              </td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => onEdit(role)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(role.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RoleTable;