import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex gap-2 flex-wrap justify-center">
        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            className="px-3 py-1 border rounded text-sm sm:text-base hover:bg-[#7a1c3d] hover:text-white transition"
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;