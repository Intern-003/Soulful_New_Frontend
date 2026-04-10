import { useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import PermissionSelector from "./PermissionSelector";

const RoleForm = ({ data, onClose, onSuccess }) => {
  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();

  const [name, setName] = useState(data?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState(
    data?.permissions?.map((p) => p.id) || []
  );

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Role name required");

    const payload = {
      name,
      permission_ids: selectedPermissions, // ✅ unified
    };

    try {
      if (data) {
        await putData({ url: `/admin/roles/${data.id}`, data: payload });
      } else {
        await postData({ url: "/admin/roles", data: payload });
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving role");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Role" : "Create Role"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role name"
          className="w-full border p-2 rounded mb-4"
        />

        <PermissionSelector
          selected={selectedPermissions}
          onChange={setSelectedPermissions}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded"
          >
            {data
              ? putLoading
                ? "Updating..."
                : "Update"
              : postLoading
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;