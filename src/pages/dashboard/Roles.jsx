import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

import RoleTable from "../../components/dashboard/roles/RoleTable";
import RoleForm from "../../components/dashboard/roles/RoleForm";

const Roles = () => {
  const { data, loading, refetch } = useGet("/admin/roles");
  const { deleteData } = useDelete();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const roles = data || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      await deleteData({ url: `admin/roles/${id}` });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Roles Management
          </h1>
          <p className="text-sm text-gray-500">
            Create roles and assign permissions
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg"
        >
          + Add Role
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border">

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <RoleTable
            roles={roles}
            onEdit={(role) => {
              setSelected(role);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

      </div>

      {/* MODAL */}
      {open && (
        <RoleForm
          data={selected}
          onClose={() => setOpen(false)}
          onSuccess={refetch}
        />
      )}

    </div>
  );
};

export default Roles;