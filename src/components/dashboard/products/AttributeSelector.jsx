import { useEffect } from "react";
import { Check, Tag } from "lucide-react";

const AttributeSelector = ({ selected = {}, onChange, attributes = [], loading = false, onConfirmVariants }) => {
  const toggle = (attrId, valueId) => {
    const existing = selected[attrId] || [];
    const updatedValues = existing.includes(valueId)
      ? existing.filter((id) => id !== valueId)
      : [...existing, valueId];

    onChange({ ...selected, [attrId]: updatedValues });
  };

  useEffect(() => {
    const cleaned = {};
    Object.keys(selected).forEach((key) => {
      if (selected[key]?.length) cleaned[key] = selected[key];
    });
    if (JSON.stringify(cleaned) !== JSON.stringify(selected)) onChange(cleaned);
  }, [selected]);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading attributes...</div>;
  if (!attributes.length) return <div className="text-center py-8 text-gray-500">No attributes available</div>;

  const totalSelected = Object.values(selected).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Tag size={20} />
          Product Attributes
        </h3>
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{totalSelected} value(s) selected</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map((attr) => (
          <div key={attr.id} className="border rounded-xl p-4 bg-gray-50">
            <h4 className="font-semibold mb-3 text-gray-800">{attr.name}</h4>
            <div className="flex flex-wrap gap-2">
              {attr.values.map((val) => {
                const isSelected = selected[attr.id]?.includes(val.id);
                return (
                  <button
                    key={val.id}
                    type="button"
                    onClick={() => toggle(attr.id, val.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      isSelected ? "bg-[#7a1c3d] text-white shadow-md" : "bg-white border hover:border-[#7a1c3d] hover:shadow"
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    <div className="flex items-center gap-2">
                      {val.hex_code && (
                        <span
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: val.hex_code }}
                        />
                      )}
                      <span>{val.value}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {onConfirmVariants && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => onConfirmVariants(selected)}
            disabled={!Object.values(selected).some(arr => arr?.length)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Confirm Variants
          </button>
        </div>
      )}
    </div>
  );
};

export default AttributeSelector;