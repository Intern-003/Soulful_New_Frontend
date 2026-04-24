import React, { useMemo } from "react";
import { getImageUrl } from "../../../utils/getImageUrl";

const CategoryItem = ({ item, onClick, onEdit, onDelete }) => {
  // ✅ Memoized image URL
  const imageUrl = useMemo(() => {
    return item?.image
      ? getImageUrl(item.image)
      : "/no-image.png";
  }, [item?.image]);

  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition">
      {/* LEFT SIDE */}
      <div
        onClick={() => onClick?.(item)}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img
          src={imageUrl}
          alt="category"
          className="h-10 w-10 object-cover rounded border bg-gray-100"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src.includes("no-image.png")) return;
            e.currentTarget.src = "/no-image.png";
          }}
        />

        <div>
          <p className="font-semibold text-gray-800">
            {item?.name || "No Name"}
          </p>

          <p className="text-xs text-gray-500">
            Click to view subcategories
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {/* POSITION */}
        <span className="text-xs text-gray-400">
          #{item?.position ?? "-"}
        </span>

        {/* STATUS */}
        <span
          className={`px-2 py-1 text-xs rounded ${
            item?.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item?.status ? "Active" : "Inactive"}
        </span>

        {/* EDIT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(item);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
        >
          Edit
        </button>

        {/* DELETE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(item);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default React.memo(CategoryItem);