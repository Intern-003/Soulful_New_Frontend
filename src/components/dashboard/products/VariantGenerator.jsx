import { useState } from "react";
import toast from "react-hot-toast";

const VariantGenerator = ({ attributes, selectedValues, onGenerated, existingVariants = [] }) => {
  const generateCombinations = (arrays) => {
    return arrays.reduce(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]]
    );
  };

  const generate = () => {
    // Check if attributes are selected
    const hasSelectedAttributes = Object.values(selectedValues).some(arr => arr.length > 0);
    
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

    const result = combos.map((combo) => ({
      attribute_value_ids: combo.map((c) => c.id),
      sku: combo.map((c) => c.value).join("-"),
      price: "",
      discount_price: "",
      stock: "",
      weight: "",
      barcode: "",
      image: null,
    }));

    // Check for duplicates with existing variants
    if (existingVariants.length > 0) {
      const existingSkus = new Set(existingVariants.map(v => v.sku));
      const duplicates = result.filter(v => existingSkus.has(v.sku));
      
      if (duplicates.length > 0) {
        toast.warning(`${duplicates.length} variant(s) already exist and will be skipped`);
        
        // Filter out duplicates
        const uniqueResult = result.filter(v => !existingSkus.has(v.sku));
        
        if (uniqueResult.length === 0) {
          toast.error("All generated variants already exist!");
          return;
        }
        
        onGenerated(uniqueResult);
        toast.success(`${uniqueResult.length} new variant(s) generated 🚀`);
        return;
      }
    }

    onGenerated(result);
    toast.success(`${result.length} variant(s) generated 🚀`);
  };

  return (
    <div className="mt-4">
      <button 
        onClick={generate} 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      >
        Generate Variants
      </button>
    </div>
  );
};

export default VariantGenerator;