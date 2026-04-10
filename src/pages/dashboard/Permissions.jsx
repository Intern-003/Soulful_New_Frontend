import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

import PermissionForm from "../../components/dashboard/permissions/PermissionForm";
import PermissionList from "../../components/dashboard/permissions/PermissionList";
import PermissionModal from "../../components/dashboard/permissions/PermissionModal"; // ✅ NEW

const Permissions = () => {
  const { data, loading, refetch } = useGet("/admin/permissions");
  const { deleteData } = useDelete();

  const permissions = data || [];

  // ✅ EDIT STATE
  const [selected, setSelected] = useState(null);

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete permission?")) return;

    try {
      await deleteData({
        url: `/admin/permissions/${id}`,
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 EDIT
  const handleEdit = (perm) => {
    setSelected(perm);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Permissions Management
        </h1>
        <p className="text-gray-500 text-sm">
          Create and manage system permissions
        </p>
      </div>

      {/* CREATE */}
      <PermissionForm onSuccess={refetch} />

      {/* LIST */}
      {loading ? (
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="h-10 bg-gray-200 animate-pulse rounded" />
        </div>
      ) : (
        <PermissionList
          permissions={permissions}
          onDelete={handleDelete}
          onEdit={handleEdit} // ✅ ADDED
        />
      )}

      {/* ✅ EDIT MODAL */}
      {selected && (
        <PermissionModal
          data={selected}
          onClose={() => setSelected(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default Permissions;