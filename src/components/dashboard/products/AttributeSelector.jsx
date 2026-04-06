// src/components/dashboard/products/AttributeSelector.jsx

import { useEffect } from "react";
import useGet from "../../../api/hooks/useGet";

const AttributeSelector = ({ selected = {}, onChange }) => {
  const { data, loading } = useGet("/admin/attributes-with-values");

  const attributes = data?.data || [];

  // 🔹 Toggle value inside attribute
  const toggle = (attrId, valueId) => {
    const existing = selected[attrId] || [];

    let updatedValues;

    if (existing.includes(valueId)) {
      updatedValues = existing.filter((id) => id !== valueId);
    } else {
      updatedValues = [...existing, valueId];
    }

    onChange({
      ...selected,
      [attrId]: updatedValues,
    });
  };

  // 🔹 Remove empty attributes
  useEffect(() => {
    const cleaned = {};

    Object.keys(selected).forEach((key) => {
      if (selected[key]?.length) {
        cleaned[key] = selected[key];
      }
    });

    if (JSON.stringify(cleaned) !== JSON.stringify(selected)) {
      onChange(cleaned);
    }
  }, [selected]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading attributes...</p>;
  }

  return (
    <div className="space-y-6">

      {attributes.map((attr) => (
        <div key={attr.id}>

          {/* 🔹 Attribute Title */}
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            {attr.name}
          </h3>

          {/* 🔹 Values */}
          <div className="flex flex-wrap gap-2">
            {attr.values.map((val) => {
              const isSelected = selected[attr.id]?.includes(val.id);

              return (
                <button
                  key={val.id}
                  type="button"
                  onClick={() => toggle(attr.id, val.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                    isSelected
                      ? "bg-[#7a1c3d] text-white border-[#7a1c3d] shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                  }`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>

        </div>
      ))}

    </div>
  );
};

export default AttributeSelector;