// ===============================
// ✅ BrandTableRow.jsx (MODERN UI)
// ===============================
import { getImageUrl } from "../../../utils/getImageUrl";

export const BrandTableRow = ({ brand, index, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-3">{index + 1}</td>

      <td>
        <img
          src={getImageUrl(brand.logo)}
          alt={brand.name}
          className="w-10 h-10 object-cover rounded"
          onError={(e) => (e.target.src = "/no-image.png")}
        />
      </td>

      <td className="font-medium">{brand.name}</td>
      <td className="text-gray-500">{brand.slug}</td>

      <td>
        <span
          className={`px-2 py-1 text-xs rounded-full text-white ${
            brand.status ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {brand.status ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="text-right space-x-2">
        <button
          onClick={() => onEdit(brand)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(brand)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BrandTableRow;