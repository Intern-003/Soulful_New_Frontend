import toast from "react-hot-toast";
import { Sparkles, AlertTriangle } from "lucide-react";

const VariantGenerator = ({ attributes, selectedValues, onGenerated, disabled, existingVariants = [] }) => {
  const generateCombinations = (arrays) => {
    return arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])), [[]]);
  };

  const generate = () => {
    const hasSelection = Object.values(selectedValues).some((arr) => arr && arr.length > 0);

    if (!hasSelection) {
      toast.error("Please select attribute values first");
      return;
    }

    const grouped = {};
    attributes.forEach((attr) => {
      const ids = selectedValues[attr.id] || [];
      const vals = attr.values.filter((v) => ids.includes(v.id));
      if (vals.length) grouped[attr.id] = vals;
    });

    const combos = generateCombinations(Object.values(grouped));

    if (!combos.length) {
      toast.error("No combinations could be generated");
      return;
    }

    const existingSkus = new Set(existingVariants.map(v => v.sku?.toLowerCase()));
    
    const result = combos.map((combo) => ({
      attribute_value_ids: combo.map((c) => c.id),
      sku: combo.map((c) => c.value).join("-"),
      price: "",
      stock: "",
      weight: "",
      barcode: "",
      image: null,
      preview: null,
    })).filter(variant => !existingSkus.has(variant.sku.toLowerCase()));

    if (result.length === 0) {
      toast.error("All variant combinations already exist");
      return;
    }

    onGenerated(result);
    toast.success(`${result.length} new variant(s) generated! 🚀`);
  };

  const selectedCount = Object.values(selectedValues).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
       
        <button
          onClick={generate}
          disabled={disabled || selectedCount === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          <Sparkles size={18} />
          Confirm Variants
        </button>
      </div>
      
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