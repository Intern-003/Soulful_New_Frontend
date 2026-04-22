import toast from "react-hot-toast";
import { Sparkles, AlertTriangle } from "lucide-react";

const VariantGenerator = ({ attributes, selectedValues, onGenerated, disabled, existingVariants = [] }) => {
  const generateCombinations = (arrays) => {
    return arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])), [[]]);
  };

  const generate = () => {
    const hasSelection = Object.values(selectedValues).some(arr => arr?.length);

    if (!hasSelection) {
      toast.error("Please select attribute values first");
      return;
    }

    const grouped = {};
    attributes.forEach(attr => {
      const ids = selectedValues[attr.id] || [];
      const vals = attr.values.filter(v => ids.includes(v.id));
      if (vals.length) grouped[attr.id] = vals;
    });

    const combos = generateCombinations(Object.values(grouped));

    const result = combos.map(combo => ({
      attribute_value_ids: combo.map(c => c.id),
      sku: combo.map(c => c.value).join("-").toUpperCase(),
      price: "",
      stock: "",
      weight: "",
      barcode: "",
      images: [],
      previews: [],
      isSaved: false,
      isNew: true,
      isEdited: false
    }));

    onGenerated(result);
  };

  const selectedCount = Object.values(selectedValues).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
      <button
        onClick={generate}
        disabled={disabled || selectedCount === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Sparkles size={18} />
        Generate Variants
      </button>

      {selectedCount === 0 && (
        <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded">
          <AlertTriangle size={16} />
          <span className="text-sm">Select attribute values above to generate variants</span>
        </div>
      )}
    </div>
  );
};

export default VariantGenerator;