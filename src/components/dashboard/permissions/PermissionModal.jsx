import { useState } from "react";
import usePut from "../../../api/hooks/usePut";

const ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "custom",
];

const PermissionModal = ({ data, onClose, onSuccess }) => {
  const { putData, loading } = usePut();

  const [form, setForm] = useState({
    module: data.module,
    action: data.action,
    customAction: "",
  });

  const finalAction =
    form.action === "custom"
      ? form.customAction
      : form.action;

  const handleUpdate = async () => {
    if (!form.module.trim()) return alert("Module required");
    if (!finalAction.trim()) return alert("Action required");

    try {
      await putData({
        url: `/admin/permissions/${data.id}`,
        data: {
          module: form.module.toLowerCase().trim(),
          action: finalAction.toLowerCase().trim(),
        },
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="font-bold mb-4">Edit Permission</h2>

        {/* MODULE */}
        <input
          value={form.module}
          onChange={(e) =>
            setForm({ ...form, module: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        />

        {/* ACTION */}
        <select
          value={form.action}
          onChange={(e) =>
            setForm({ ...form, action: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        >
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a === "custom" ? "+ Custom Action" : a}
            </option>
          ))}
        </select>

        {/* 🔥 CUSTOM INPUT */}
        {form.action === "custom" && (
          <input
            placeholder="Enter custom action (e.g. approve)"
            value={form.customAction}
            onChange={(e) =>
              setForm({ ...form, customAction: e.target.value })
            }
            className="border p-2 w-full mb-3 rounded"
          />
        )}

        {/* 🔥 PREVIEW */}
        <p className="text-sm text-gray-500 mb-3">
          → {(form.module || "module").toLowerCase()}.
          {(finalAction || "action").toLowerCase()}
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleUpdate}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;