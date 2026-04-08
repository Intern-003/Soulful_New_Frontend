import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import ProductCard from "../../../components/dashboard/products/ProductCard";
const SubCategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSubcategory();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/products?category=${id}`
      );

      setProducts(res.data.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategory = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/categories/${id}`
      );

      setSubcategory(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 text-sm"
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold">
            {subcategory?.name || "Products"}
          </h1>

          <p className="text-sm text-gray-500">
            Manage products in this subcategory
          </p>
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          + Add Product
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found in this subcategory
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryProducts;