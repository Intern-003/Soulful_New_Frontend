// src/components/dashboard/products/AttributeManager.jsx
import React, { useState, useEffect } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useDelete from "../../../api/hooks/useDelete";
import { X, Plus, Edit2, Trash2, Save, ChevronRight, ChevronDown, Settings } from "lucide-react";
import toast from "react-hot-toast";

const AttributeManager = ({ onClose, onSuccess }) => {
  const { data, refetch } = useGet("/admin/attributes-with-values");
  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

  const [attributes, setAttributes] = useState([]);
  const [expandedAttributes, setExpandedAttributes] = useState({});
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [attributeForm, setAttributeForm] = useState({ name: "" });
  const [attributeSubmitting, setAttributeSubmitting] = useState(false);

  // Value management states
  const [showValueForm, setShowValueForm] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [valueForm, setValueForm] = useState({ value: "", hex_code: "" });
  const [valueSubmitting, setValueSubmitting] = useState(false);

  const selectedAttribute = attributes.find(
    (a) => a.id === selectedAttributeId
  );

  const isColor =
    selectedAttribute?.name?.toLowerCase().includes("color");
  useEffect(() => {
    if (data?.data) {
      setAttributes(data.data);
    }
  }, [data]);

  const toggleAttribute = (attrId) => {
    setExpandedAttributes(prev => ({ ...prev, [attrId]: !prev[attrId] }));
  };

  // ========== ATTRIBUTE CRUD ==========
  const handleAddAttribute = async () => {
    if (!attributeForm.name.trim()) {
      toast.error("Attribute name is required");
      return;
    }

    setAttributeSubmitting(true);
    try {
      if (editingAttribute) {
        await putData({
          url: `/admin/attributes/${editingAttribute.id}`,
          data: { name: attributeForm.name }
        });
        toast.success("Attribute updated successfully");
      } else {
        await postData({
          url: "/admin/attributes",
          data: { name: attributeForm.name }
        });
        toast.success("Attribute created successfully");
      }

      setShowAttributeForm(false);
      setEditingAttribute(null);
      setAttributeForm({ name: "" });
      refetch({ force: true });
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setAttributeSubmitting(false);
    }
  };

  const handleEditAttribute = (attribute) => {
    setEditingAttribute(attribute);
    setAttributeForm({ name: attribute.name });
    setShowAttributeForm(true);
  };

  const handleDeleteAttribute = async (attribute) => {
    if (!window.confirm(`Delete attribute "${attribute.name}"? This will also delete all its values.`)) return;

    try {
      await deleteData({ url: `/admin/attributes/${attribute.id}` });
      toast.success("Attribute deleted successfully");
      refetch({ force: true });
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete attribute");
    }
  };

  // ========== VALUE CRUD ==========
  const handleAddValue = async () => {
    if (!valueForm.value.trim()) {
      toast.error("Value is required");
      return;
    }

    setValueSubmitting(true);
    try {
      if (editingValue) {
        await putData({
          url: `/admin/attribute-values/${editingValue.id}`,
          data: { value: valueForm.value, hex_code: isColor ? valueForm.hex_code : null },

        });
        toast.success("Value updated successfully");
      } else {
        await postData({
          url: `/admin/attributes/${selectedAttributeId}/values`,
          data: { value: valueForm.value, hex_code: isColor ? valueForm.hex_code : null },
        });
        toast.success("Value added successfully");
      }

      setShowValueForm(false);
      setEditingValue(null);
      setValueForm({ value: "", hex_code: "" });


      refetch({ force: true });
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setValueSubmitting(false);
    }
  };

  const handleEditValue = (attributeId, value) => {
    setSelectedAttributeId(attributeId);
    setEditingValue(value);

    setValueForm({
      value: value.value || "",
      hex_code: value.hex_code || "",
    });
    setShowValueForm(true);
  };

  const handleDeleteValue = async (valueId) => {
    if (!window.confirm("Delete this value?")) return;

    try {
      await deleteData({ url: `/admin/attribute-values/${valueId}` });
      toast.success("Value deleted successfully");
      refetch({ force: true });
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete value");
    }
  };

  const openValueForm = (attributeId) => {
    setSelectedAttributeId(attributeId);
    setEditingValue(null);
    setValueForm({ value: "", hex_code: "" });
    setShowValueForm(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#7a1c3d] to-[#9b2c4f] px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Settings size={24} />
            Manage Attributes
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Attribute Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingAttribute(null);
                setAttributeForm({ name: "" });
                setShowAttributeForm(true);
              }}
              className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Attribute
            </button>
          </div>

          {/* Attributes List */}
          {attributes.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed">
              <p className="text-gray-500">No attributes created yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Attribute" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attributes.map((attr) => (
                <div key={attr.id} className="border rounded-xl overflow-hidden">
                  {/* Attribute Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <button
                      onClick={() => toggleAttribute(attr.id)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {expandedAttributes[attr.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <span className="font-semibold text-gray-800">{attr.name}</span>
                      <span className="text-xs text-gray-400">({attr.values?.length || 0} values)</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAttribute(attr)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Attribute"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAttribute(attr)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Attribute"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Attribute Values */}
                  {expandedAttributes[attr.id] && (
                    <div className="p-4 border-t bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-600">Values</h4>
                        <button
                          onClick={() => openValueForm(attr.id)}
                          className="text-sm text-[#7a1c3d] hover:text-[#5e132f] flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Add Value
                        </button>
                      </div>

                      {attr.values?.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No values added yet</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {attr.values.map((val) => (
                            <div
                              key={val.id}
                              className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 group"
                            >
                              {/* COLOR PREVIEW */}
                              {val.hex_code && (
                                <span
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: val.hex_code }}
                                />
                              )}

                              <span className="text-sm">{val.value}</span>

                              <button
                                onClick={() => handleEditValue(attr.id, val)}
                                className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition"
                              >
                                <Edit2 size={12} />
                              </button>

                              <button
                                onClick={() => handleDeleteValue(val.id)}
                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition">
            Close
          </button>
        </div>
      </div>

      {/* Attribute Form Modal */}
      {showAttributeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingAttribute ? "Edit Attribute" : "Add New Attribute"}
            </h3>
            <input
              type="text"
              value={attributeForm.name}
              onChange={(e) => setAttributeForm({ name: e.target.value })}
              placeholder="Attribute name (e.g., Size, Color)"
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAttributeForm(false);
                  setEditingAttribute(null);
                  setAttributeForm({ name: "" });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAttribute}
                disabled={attributeSubmitting}
                className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition disabled:opacity-50"
              >
                {attributeSubmitting ? "Saving..." : editingAttribute ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Value Form Modal */}
      {showValueForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingValue ? "Edit Value" : "Add New Value"}
            </h3>
            {/* <input
              type="text"
              value={valueForm.value}
              onChange={(e) => setValueForm({ value: e.target.value })}
              placeholder="Value (e.g., Large, Red, 256GB)"
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
              autoFocus
            /> */}
            <input
              type="text"
              value={valueForm.value}
              onChange={(e) =>
                setValueForm((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="Value (e.g., Red)"
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
              autoFocus
            />
            {isColor && (
              <div className="mt-3 flex items-center gap-3">

                <input
                  type="color"
                  value={valueForm.hex_code || "#000000"}
                  onChange={(e) =>
                    setValueForm((prev) => ({ ...prev, hex_code: e.target.value }))
                  }
                  className="w-10 h-10 cursor-pointer"
                />

                <input
                  type="text"
                  value={valueForm.hex_code}
                  onChange={(e) =>
                    setValueForm((prev) => ({ ...prev, hex_code: e.target.value }))
                  }
                  placeholder="#ffffff"
                  className="border px-2 py-2 text-sm rounded w-28"
                />

                {/* preview */}
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: valueForm.hex_code || "#000000" }}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowValueForm(false);
                  setEditingValue(null);
                  setValueForm({ value: "", hex_code: "" });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddValue}
                disabled={valueSubmitting}
                className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition disabled:opacity-50"
              >
                {valueSubmitting ? "Saving..." : editingValue ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeManager;