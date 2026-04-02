import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";

const Permissions = () => {
  const { data, loading, refetch } = useGet("/admin/permissions");

  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

  const permissions = data || [];

  const [form, setForm] = useState({
    id: null,
    name: "",
    module: "",
    action: "",
  });

  const [open, setOpen] = useState(false);

  // 🔥 GROUP BY MODULE
  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    try {
      if (form.id) {
        await putData({
          url: `/permissions/${form.id}`,
          data: form,
        });
      } else {
        await postData({
          url: "/permissions",
          data: form,
        });
      }

      setOpen(false);
      setForm({ id: null, name: "", module: "", action: "" });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete permission?")) return;

    try {
      await deleteData({ url: `/permissions/${id}` });
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
          <h1 className="text-2xl font-bold">Permissions</h1>
          <p className="text-sm text-gray-500">
            Manage system permissions
          </p>
        </div>

        <button
          onClick={() => {
            setForm({ id: null, name: "", module: "", action: "" });
            setOpen(true);
          }}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded"
        >
          + Add Permission
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow border p-4">

        {loading ? (
          <p>Loading...</p>
        ) : (
          Object.keys(grouped).map((module) => (
            <div key={module} className="mb-6">

              <h2 className="font-bold text-gray-700 mb-3 uppercase">
                {module}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                {grouped[module].map((perm) => (
                  <div
                    key={perm.id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">
                      {perm.action}
                    </span>

                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setForm(perm);
                          setOpen(true);
                        }}
                        className="text-blue-500 text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(perm.id)}
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          ))
        )}

      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 space-y-3">

            <h2 className="text-lg font-bold">
              {form.id ? "Edit" : "Add"} Permission
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border w-full p-2 rounded"
            />

            <input
              placeholder="Module (e.g. products)"
              value={form.module}
              onChange={(e) =>
                setForm({ ...form, module: e.target.value })
              }
              className="border w-full p-2 rounded"
            />

            <input
              placeholder="Action (e.g. create)"
              value={form.action}
              onChange={(e) =>
                setForm({ ...form, action: e.target.value })
              }
              className="border w-full p-2 rounded"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-[#7a1c3d] text-white rounded"
              >
                Save
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Permissions;