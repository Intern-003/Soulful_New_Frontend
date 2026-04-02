import React, { useState, useEffect } from "react";
import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";
import { getImageUrl } from "../../utils/getImageUrl";

import ProductForm from "../../components/dashboard/ProductForm";
import EditProductModal from "../../components/dashboard/EditProductModal";

const Products = () => {
  const { data, loading, error, refetch } = useGet("/products");
  const { deleteData } = useDelete("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔍 SEARCH + FILTER STATE
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  // 📄 PAGINATION
  const [page, setPage] = useState(1);

  // ✅ PRODUCTS
  const products = data?.data?.data || [];
  const meta = data?.data;

  // 🔍 FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStock =
      stockFilter === "in"
        ? p.stock > 0
        : stockFilter === "out"
        ? p.stock === 0
        : true;

    return matchesSearch && matchesStock;
  });

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteData({
        url: `/vendor/products/${id}`,
      });

      refetch();
    } catch (err) {
      console.log("Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  // 🔄 PAGE CHANGE (Laravel pagination)
  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch({
      url: `/products?page=${newPage}`,
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error loading products</div>;
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#7a1c3d]">Products</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex flex-wrap gap-3 mb-4">

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const image =
                  product?.images?.find((img) => img.is_primary)?.image_url ||
                  product?.images?.[0]?.image_url;

                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50">

                    <td className="p-4">
                      {image ? (
                        <img
                          src={getImageUrl(image)}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                          No Img
                        </div>
                      )}
                    </td>

                    <td className="p-4">{product.name}</td>

                    <td className="p-4">
                      ₹{product.discount_price || product.price}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          product.stock > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => setEditId(product.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

      </div>

      {/* 📄 PAGINATION */}
      {meta?.last_page > 1 && (
        <div className="flex justify-center mt-6 gap-2">

          <button
            disabled={meta.current_page === 1}
            onClick={() => handlePageChange(meta.current_page - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          {[...Array(meta.last_page)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                meta.current_page === i + 1
                  ? "bg-[#7a1c3d] text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => handlePageChange(meta.current_page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>

        </div>
      )}

      {/* MODALS */}
      {showModal && (
        <ProductForm
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}

      {editId && (
        <EditProductModal
          productId={editId}
          onClose={() => setEditId(null)}
          onSuccess={refetch}
        />
      )}

    </div>
  );
};

export default Products;