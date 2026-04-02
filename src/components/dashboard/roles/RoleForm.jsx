import { useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import PermissionSelector from "./PermissionSelector";

const RoleForm = ({ data, onClose, onSuccess }) => {
  // 🔹 API hooks
  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();

  // 🔹 State
  const [name, setName] = useState(data?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState(
    data?.permissions?.map((p) => p.id) || []
  );

  // 🔹 Submit
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Role name is required");
      return;
    }

    try {
      if (data) {
        // ✅ UPDATE ROLE
        console.log("Updating Role:", {
          name,
          permission_ids: selectedPermissions,
        });

        await putData({
          url: `/admin/roles/${data.id}`, // ✅ FIXED URL
          data: {
            name,
            permission_ids: selectedPermissions, // ✅ IMPORTANT FIX
          },
        });
      } else {
        // ✅ CREATE ROLE
        console.log("Creating Role:", {
          name,
          permissions: selectedPermissions,
        });

        await postData({
          url: "/admin/roles", // ✅ FIXED URL
          data: {
            name,
            permissions: selectedPermissions,
          },
        });
      }

      // 🔄 Refresh roles list
      await onSuccess();

      // ❌ Close modal
      onClose();

    } catch (err) {
      console.error("Role save error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg">

        {/* 🔹 HEADER */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {data ? "Edit Role" : "Create Role"}
        </h2>

        {/* 🔹 NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter role name"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]"
          />
        </div>

        {/* 🔹 PERMISSIONS */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Assign Permissions
          </h3>

          <PermissionSelector
            selected={selectedPermissions}
            onChange={setSelectedPermissions}
          />
        </div>

        {/* 🔹 ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={postLoading || putLoading}
            className="px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {data
              ? putLoading
                ? "Updating..."
                : "Update Role"
              : postLoading
              ? "Creating..."
              : "Create Role"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RoleForm;