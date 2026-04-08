import { useState } from "react";

const generateCombinations = (arrays) => {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]]
  );
};

const VariantGenerator = ({ attributes, selectedValues, onGenerated }) => {
  const [variants, setVariants] = useState([]);

  const generate = () => {
    const grouped = {};

    attributes.forEach((attr) => {
      const ids = selectedValues[attr.id] || [];
      const vals = attr.values.filter((v) => ids.includes(v.id));
      if (vals.length) grouped[attr.id] = vals;
    });

    const combos = generateCombinations(Object.values(grouped));

    const result = combos.map((combo) => ({
      attribute_value_ids: combo.map((c) => c.id),
      sku: combo.map((c) => c.value).join("-"),
      price: "",
      stock: "",
    }));

    setVariants(result);
    onGenerated(result);
  };

  return (
    <div className="mt-4">
      <button onClick={generate} className="bg-blue-500 text-white px-4 py-2">
        Auto Generate
      </button>
    </div>
  );
};

export default VariantGenerator;