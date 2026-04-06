// src/pages/dashboard/Attributes.jsx

import React, { useState , useEffect } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";

const Attributes = () => {
  const { data, refetch } = useGet("/admin/attributes-with-values");

  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

const [attributes, setAttributes] = useState([]);

useEffect(() => {
  if (data?.data) {
    setAttributes(data.data);
  }
}, [data]);

  const [newAttr, setNewAttr] = useState("");
  const [valueInputs, setValueInputs] = useState({});
  const [search, setSearch] = useState("");
  const [editingAttr, setEditingAttr] = useState(null);
  const [editingValue, setEditingValue] = useState(null);

  // ✅ SIMPLE TOAST
  const showToast = (msg) => {
    alert(msg);
  };

  // ✅ CREATE ATTRIBUTE
const createAttribute = async () => {
  if (!newAttr.trim()) return;

  const res = await postData({
    url: "/admin/attributes",
    data: { name: newAttr },
  });

  const newAttribute = res?.data;

  // 🔥 ADD INSTANTLY
  setAttributes((prev) => [
    ...prev,
    { ...newAttribute, values: [] },
  ]);

  setNewAttr("");
  showToast("Attribute Created ✅");
};

  // ✅ UPDATE ATTRIBUTE
  const updateAttribute = async (id, name) => {
    await putData({
      url: `/admin/attributes/${id}`,
      data: { name },
    });

    setEditingAttr(null);
    showToast("Attribute Updated ✏️");
    refetch();
  };

  // ✅ CREATE VALUE
  const createValue = async (attrId) => {
    const value = valueInputs[attrId];
    if (!value) return;

    await postData({
      url: `/admin/attributes/${attrId}/values`,
      data: { value },
    });

    setValueInputs((prev) => ({ ...prev, [attrId]: "" }));
    showToast("Value Added ✅");
    refetch();
  };

  // ✅ UPDATE VALUE
const updateValue = async (id, value) => {
  const res = await putData({
    url: `/admin/attribute-values/${id}`,
    data: { value },
  });

  const updated = res?.data;

  // 🔥 UPDATE UI
  setAttributes((prev) =>
    prev.map((attr) => ({
      ...attr,
      values: attr.values.map((v) =>
        v.id === id ? { ...v, ...updated } : v
      ),
    }))
  );

  setEditingValue(null);
  showToast("Value Updated ✏️");
};
  // ✅ DELETE ATTRIBUTE
  const deleteAttribute = async (id) => {
    if (!window.confirm("Delete attribute?")) return;

    await deleteData({
      url: `/admin/attributes/${id}`,
    });

      setAttributes((prev) => prev.filter((a) => a.id !== id));

    showToast("Attribute Deleted ❌");
    refetch();
  };

  // ✅ DELETE VALUE
const deleteValue = async (id, attrId) => {
  if (!window.confirm("Delete value?")) return;

  await deleteData({
    url: `/admin/attribute-values/${id}`,
  });

  // 🔥 UPDATE UI
  setAttributes((prev) =>
    prev.map((attr) =>
      attr.id === attrId
        ? {
            ...attr,
            values: attr.values.filter((v) => v.id !== id),
          }
        : attr
    )
  );

  showToast("Value Deleted ❌");
};

  // ✅ FILTER
  const filtered = attributes.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Attributes Management
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search attribute..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-5"
      />

      {/* CREATE ATTRIBUTE */}
      <div className="flex gap-3 mb-6">
        <input
          value={newAttr}
          onChange={(e) => setNewAttr(e.target.value)}
          placeholder="New Attribute"
          className="border p-2 rounded w-64"
        />

        <button
          onClick={createAttribute}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded"
        >
          Add Attribute
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-5">
        {filtered.map((attr) => (
          <div key={attr.id} className="border p-4 rounded-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">

              {editingAttr === attr.id ? (
                <input
                  defaultValue={attr.name}
                  onBlur={(e) =>
                    updateAttribute(attr.id, e.target.value)
                  }
                  className="border p-1 rounded"
                  autoFocus
                />
              ) : (
                <h2
                  onDoubleClick={() => setEditingAttr(attr.id)}
                  className="font-semibold text-lg cursor-pointer"
                >
                  {attr.name}
                </h2>
              )}

              <button
                onClick={() => deleteAttribute(attr.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

            {/* VALUES */}
            <div className="flex flex-wrap gap-2 mb-3">

              {attr.values.map((val) => {
                const isColor =
                  attr.name.toLowerCase() === "color";

                return (
                  <div
                    key={val.id}
                    className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100"
                  >

                    {/* 🎨 COLOR PREVIEW */}
                    {isColor && (
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ background: val.value }}
                      />
                    )}

                    {editingValue === val.id ? (
                      <input
                        defaultValue={val.value}
                        onBlur={(e) =>
                          updateValue(val.id, e.target.value)
                        }
                        className="border p-1 rounded"
                        autoFocus
                      />
                    ) : (
                      <span
                        onDoubleClick={() =>
                          setEditingValue(val.id)
                        }
                        className="cursor-pointer"
                      >
                        {val.value}
                      </span>
                    )}

                    <button
                      onClick={() => deleteValue(val.id)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

            </div>

            {/* ADD VALUE */}
            <div className="flex gap-2">
              <input
                value={valueInputs[attr.id] || ""}
                onChange={(e) =>
                  setValueInputs((prev) => ({
                    ...prev,
                    [attr.id]: e.target.value,
                  }))
                }
                placeholder="Add value"
                className="border p-2 rounded"
              />

              <button
                onClick={() => createValue(attr.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Attributes;