import React, { useEffect, useState, useRef } from "react";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";
import ProductImages from "./ProductImages";
import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import ProductSpecifications from "./ProductSpecifications";
import { X, Save, AlertCircle, Package, Image as ImageIcon, Tag, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const EditProductModal = ({ productId, onClose, onSuccess }) => {
  const { data, loading, refetch } = useGet(`/vendor/products/${productId}`);
  const { putData, loading: updating } = usePut();
  const { data: categoryData } = useGet("/categories");
  const { data: brandData } = useGet("/brands");
  const { data: subcategoryData, refetch: fetchSubcategories } = useGet("", { autoFetch: false });
  const { data: attributeData } = useGet("/admin/attributes-with-values");

  const product = data?.data;
  const variantRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [specifications, setSpecifications] = useState([]);
  const [form, setForm] = useState({
    name: "", short_description: "", description: "", price: "", discount_price: "",
    cost_price: "", stock: "", category_id: "", brand_id: "", weight: "", length: "",
    width: "", height: "", is_featured: false, status: false, approval_status: "",
  });
  const [parentCategory, setParentCategory] = useState("");
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [existingVariants, setExistingVariants] = useState([]);
  const [pendingVariants, setPendingVariants] = useState([]);
  const [productImages, setProductImages] = useState([]);

  // Load product data and populate form
  useEffect(() => {
    if (!product) return;

    const isSub = !!product.category?.parent_id;

    setForm({
      name: product.name || "",
      short_description: product.short_description || "",
      description: product.description || "",
      price: product.price ?? "",
      discount_price: product.discount_price ?? "", // FIXED: Added discount_price
      cost_price: product.cost_price ?? "",
      stock: product.stock ?? "",
      category_id: product.category_id || "",
      brand_id: product.brand_id || "",
      weight: product.weight || "",
      length: product.length || "",
      width: product.width || "",
      height: product.height || "",
      is_featured: product.is_featured || false,
      status: product.status || false,
    });

    setSpecifications(product.specifications || []);
    setProductImages(product.images || []);
    setExistingVariants(product.variants || []);

    if (isSub) {
      const parentId = product.category.parent_id;
      setParentCategory(parentId);
      fetchSubcategories({ url: `/categories/${parentId}/children` }).then(() => {
        setForm(prev => ({ ...prev, category_id: product.category_id }));
      });
    } else {
      setParentCategory(product.category?.id || "");
    }
  }, [product]);

  // Map variant attributes to selected values
  useEffect(() => {
    if (!product?.variants?.length) return;

    const selectedAttrs = {};
    product.variants.forEach(variant => {
      if (variant.attributes) {
        variant.attributes.forEach(attr => {
          if (!selectedAttrs[attr.attribute_id]) {
            selectedAttrs[attr.attribute_id] = [];
          }
          if (!selectedAttrs[attr.attribute_id].includes(attr.value_id)) {
            selectedAttrs[attr.attribute_id].push(attr.value_id);
          }
        });
      }
    });
    setSelectedAttributeValues(selectedAttrs);
  }, [product?.variants]);

  useEffect(() => {
    if (pendingVariants.length > 0) {
      variantRef.current?.addVariants(pendingVariants);
      setPendingVariants([]);
    }
  }, [pendingVariants]);

  const handleCategoryChange = async (e) => {
    const parentId = Number(e.target.value);
    setParentCategory(parentId);
    setForm((prev) => ({ ...prev, category_id: "" }));
    if (parentId) {
      await fetchSubcategories({ url: `/categories/${parentId}/children` });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numberFields = ["price", "discount_price", "cost_price", "stock", "length", "width", "height", "weight"];
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : numberFields.includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const generateVariants = (selectedValues, attributesList) => {
    const selectedAttributes = attributesList.filter(attr => 
      selectedValues[attr.id]?.length > 0
    );

    if (selectedAttributes.length === 0) return [];

    const valueArrays = selectedAttributes.map(attr => {
      const selectedValueIds = selectedValues[attr.id] || [];
      return attr.values.filter(v => selectedValueIds.includes(v.id));
    });

    const combinations = valueArrays.reduce(
      (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
      [[]]
    );

    return combinations.map(combo => ({
      attribute_value_ids: combo.map(c => c.id),
      sku: combo.map(c => c.value).join("-").toUpperCase(),
      price: "",
      stock: "",
      weight: "",
      barcode: "",
      newImages: [],
      previews: [],
      isSaved: false,
      isNew: true,
      isModified: false,
    }));
  };

  const handleConfirmVariants = (selected) => {
    const attributes = attributeData?.data || [];
    const generated = generateVariants(selected, attributes);

    const map = new Map();
    const filtered = generated.filter(v => {
      const key = v.sku?.toLowerCase();
      if (!key) return false;
      if (map.has(key)) return false;
      map.set(key, true);
      return true;
    });

    setPendingVariants(filtered);
    setActiveTab("variants");
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: form.name,
        short_description: form.short_description,
        description: form.description,
        price: Number(form.price || 0),
        discount_price: Number(form.discount_price || 0), // FIXED: Added discount_price
        cost_price: Number(form.cost_price || 0),
        stock: Number(form.stock || 0),
        category_id: form.category_id,
        brand_id: form.brand_id || null,
        weight: Number(form.weight || 0),
        length: Number(form.length || 0),
        width: Number(form.width || 0),
        height: Number(form.height || 0),
        is_featured: form.is_featured ? 1 : 0,
        specifications: specifications.length ? specifications : null,
        approval_status: "pending",
        status: false,
      };

      await putData({ url: `/vendor/products/${productId}`, data: payload });

      toast.success("Product Updated Successfully ✅");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#7a1c3d] mx-auto" />
          <p className="mt-3 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data?.data || brandData?.data || [];
  const attributes = attributeData?.data || [];

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package, shortLabel: "Info" },
    { id: "images", label: "Images", icon: ImageIcon, shortLabel: "Images" },
    { id: "specifications", label: "Specifications", icon: Tag, shortLabel: "Specs" },
    { id: "attributes", label: "Attributes", icon: Settings, shortLabel: "Attrs" },
    { id: "variants", label: "Variants", icon: Package, shortLabel: "Vars" },
  ];

  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
  const nextTab = tabs[currentIndex + 1];
  const prevTab = tabs[currentIndex - 1];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7a1c3d] to-[#9b2c4f] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white">✏️ Edit Product</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition">
            <X size={18} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Status Banner */}
        {product?.approval_status === "pending" && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mx-3 sm:mx-6 mt-3 sm:mt-4 rounded flex-shrink-0">
            <div className="flex items-start sm:items-center gap-2">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={16} />
              <span className="text-xs sm:text-sm text-yellow-800">
                This product is pending admin approval.
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b px-3 sm:px-6 overflow-x-auto flex-shrink-0 bg-white">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-5 py-2 sm:py-3 font-medium transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base
                  ${activeTab === tab.id ? "text-[#7a1c3d] border-b-2 border-[#7a1c3d]" : "text-gray-500 hover:text-gray-700"}`}
              >
                <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b sm:hidden flex-shrink-0">
          <button
            onClick={() => prevTab && setActiveTab(prevTab.id)}
            disabled={!prevTab}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm ${prevTab ? 'bg-[#7a1c3d] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <ChevronLeft size={14} />
            {prevTab?.shortLabel || 'Prev'}
          </button>
          <span className="text-sm font-medium text-gray-600">{tabs.find(t => t.id === activeTab)?.label}</span>
          <button
            onClick={() => nextTab && setActiveTab(nextTab.id)}
            disabled={!nextTab}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm ${nextTab ? 'bg-[#7a1c3d] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {nextTab?.shortLabel || 'Next'}
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#7a1c3d]" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input name="short_description" value={form.short_description} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={parentCategory} onChange={handleCategoryChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subcategory</label>
                <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                  <option value="">Select Subcategory</option>
                  {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base">
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div><label className="block text-sm font-medium mb-1">Price *</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" /></div>
              <div><label className="block text-sm font-medium mb-1">Discount Price</label><input name="discount_price" type="number" step="0.01" value={form.discount_price} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" /></div>
              <div><label className="block text-sm font-medium mb-1">Cost Price</label><input name="cost_price" type="number" step="0.01" value={form.cost_price} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" /></div>
              <div><label className="block text-sm font-medium mb-1">Stock</label><input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" /></div>

              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <div><label className="block text-sm font-medium mb-1">Length (cm)</label><input name="length" type="number" step="0.01" value={form.length} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
                <div><label className="block text-sm font-medium mb-1">Width (cm)</label><input name="width" type="number" step="0.01" value={form.width} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
                <div><label className="block text-sm font-medium mb-1">Height (cm)</label><input name="height" type="number" step="0.01" value={form.height} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
                <div><label className="block text-sm font-medium mb-1">Weight (kg)</label><input name="weight" type="number" step="0.01" value={form.weight} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">⭐ Feature this product</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <ProductImages
              productId={productId}
              images={productImages}
              onRefresh={() => {
                refetch();
                if (data?.data?.images) setProductImages(data.data.images);
              }}
            />
          )}

          {activeTab === "specifications" && (
            <ProductSpecifications
              productId={productId}
              isLocked={false}
              onSpecificationsChange={setSpecifications}
            />
          )}

          {activeTab === "attributes" && (
            <AttributeSelector
              attributes={attributes}
              selected={selectedAttributeValues}
              onChange={setSelectedAttributeValues}
              onConfirmVariants={handleConfirmVariants}
            />
          )}

          {activeTab === "variants" && (
            <div className="space-y-4 sm:space-y-6">
              <VariantSection
                ref={variantRef}
                productId={productId}
                onVariantsLoaded={setExistingVariants}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-100 transition text-sm sm:text-base order-2 sm:order-1">Cancel</button>
          <button onClick={handleUpdate} className="bg-[#7a1c3d] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#5e132f] transition flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2" disabled={updating}>
            <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
            {updating ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;