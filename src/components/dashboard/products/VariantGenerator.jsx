import toast from "react-hot-toast";

const VariantGenerator = ({ attributes, selectedValues, onGenerated, disabled, existingVariants = [] }) => {
  const generateCombinations = (arrays) => {
    return arrays.reduce(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]]
    );
  };

  const generate = () => {
    const hasSelectedAttributes = Object.values(selectedValues).some(
      (arr) => arr.length > 0
    );

    if (!hasSelectedAttributes) {
      toast.error("Please select at least one attribute value");
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
      toast.error("Select attributes first");
      return;
    }

    // 🔥 existing SKU set (case-insensitive)
    const existingSkuSet = new Set(
  existingVariants.map((v) => v.sku.toLowerCase())
);

// ALSO consider already generated but unsaved variants
const generatedSkuSet = new Set(
  (existingVariants || []).map((v) => v.sku.toLowerCase())
);

const result = combos
  .map((combo) => {
    const sku = combo.map((c) => c.value).join("-");

    return {
      attribute_value_ids: combo.map((c) => c.id),
      sku,
      price: "",
      discount_price: "",
      stock: "",
      weight: "",
      barcode: "",
      image: null,
      preview: null,
    };
  })
  .filter((v) => {
    const skuLower = v.sku.toLowerCase();
    return !existingSkuSet.has(skuLower);
  });
  
    if (result.length === 0) {
      toast.error("All generated variants already exist");
      return;
    }

    onGenerated(result);
    toast.success(`${result.length} variant(s) generated 🚀`);
  };

  return (
    <div className="mt-4">
      <button
        onClick={generate}
        disabled={disabled}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Confirm Variants
      </button>
    </div>
  );
};

export default VariantGenerator;