import { useState } from "react";
import usePost from "../../../api/hooks/usePost";

const DEFAULT_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
];

const PermissionForm = ({ onSuccess }) => {
  const { postData, loading } = usePost();

  const [form, setForm] = useState({
    module: "",
    action: "view",
    customAction: "",
  });

  // 🔥 Final Action Resolver
  const finalAction =
    form.action === "custom"
      ? form.customAction
      : form.action;

  // 🔥 Submit
  const handleSubmit = async () => {
    if (!form.module.trim()) {
      alert("Module required");
      return;
    }

    if (!finalAction.trim()) {
      alert("Action required");
      return;
    }

    try {
      await postData({
        url: "/admin/permissions",
        data: {
          module: form.module.toLowerCase().trim(),
          action: finalAction.toLowerCase().trim(),
        },
      });

      // ✅ Reset
      setForm({
        module: "",
        action: "view",
        customAction: "",
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create permission");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center flex-wrap">
      
      {/* MODULE */}
      <input
        type="text"
        placeholder="Module (e.g. product)"
        value={form.module}
        onChange={(e) =>
          setForm({ ...form, module: e.target.value })
        }
        className="border px-3 py-2 rounded-lg text-sm w-48"
      />

      {/* ACTION SELECT */}
      <select
        value={form.action}
        onChange={(e) =>
          setForm({
            ...form,
            action: e.target.value,
            customAction: "", // reset when switching
          })
        }
        className="border px-3 py-2 rounded-lg text-sm"
      >
        {DEFAULT_ACTIONS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}

        <option value="custom">+ Custom Action</option>
      </select>

      {/* CUSTOM INPUT */}
      {form.action === "custom" && (
        <input
          type="text"
          placeholder="Custom action (e.g. approve)"
          value={form.customAction}
          onChange={(e) =>
            setForm({ ...form, customAction: e.target.value })
          }
          className="border px-3 py-2 rounded-lg text-sm"
        />
      )}

      {/* PREVIEW */}
      <span className="text-sm text-gray-500">
        → {(form.module || "module").toLowerCase()}.
        {(finalAction || "action").toLowerCase()}
      </span>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={
          loading ||
          !form.module.trim() ||
          !finalAction.trim()
        }
        className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default PermissionForm;