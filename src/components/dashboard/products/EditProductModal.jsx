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
  const { data: attributeData } = useGet("/admin/attributes-with-values");
  const { refetch: fetchSubcategories } = useGet("/categories/placeholder", { autoFetch: false });

  const product = data?.data;
  const variantRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [specifications, setSpecifications] = useState([]);
  const [form, setForm] = useState({
    name: "", short_description: "", description: "", price: "", discount_price: "",
    cost_price: "", stock: "", category_id: "", brand_id: "", weight: "", length: "",
    width: "", height: "", is_featured: false,
  });
  const [parentCategory, setParentCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [existingVariants, setExistingVariants] = useState([]);
  const [pendingVariants, setPendingVariants] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  const fetchBrandsByCategory = async (categoryId) => {
    if (!categoryId) {
      setBrands([]);
      return;
    }

    setLoadingBrands(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/brands/category/${categoryId}`
      );

      const data = await res.json();
      setBrands(data?.data || []);
    } catch (err) {
      console.error("Brand fetch error:", err);
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  // Load product data and populate form
  useEffect(() => {
    if (!product) return;

    console.log("Loading product data:", product);

    setForm({
      name: product.name || "",
      short_description: product.short_description || "",
      description: product.description || "",
      price: product.price ?? "",
      discount_price: product.discount_price ?? "",
      cost_price: product.cost_price ?? "",
      stock: product.stock ?? "",
      category_id: product.category_id || "",
      brand_id: product.brand_id || "",
      weight: product.weight || "",
      length: product.length || "",
      width: product.width || "",
      height: product.height || "",
      is_featured: !!product.is_featured,
    });

    // Set specifications
    if (product.specifications && product.specifications.length > 0) {
      setSpecifications(product.specifications);
    }

    // Filter product images (only product images, not variant images)
    const onlyProductImages = product.images?.filter(img => 
      img.image_url.includes('/products/') && !img.image_url.includes('/variants/')
    ) || [];
    setProductImages(onlyProductImages);

    // Set existing variants with their images
    if (product.variants && product.variants.length > 0) {
      const formattedVariants = product.variants.map(variant => {
        // Transform variant images to the format expected by VariantSection
        const variantImages = variant.images?.map(img => ({
          id: img.id,
          url: img.image_url,
          is_primary: img.is_primary,
          image_url: img.image_url // Keep original field for compatibility
        })) || [];
        
        // Get the primary image URL if exists
        const primaryImage = variantImages.find(img => img.is_primary);
        
        return {
          id: variant.id,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          weight: variant.weight,
          barcode: variant.barcode,
          discount_price: variant.discount_price,
          attribute_value_ids: variant.attribute_value_ids,
          attributes: variant.attributes,
          // Important: Pass the images to existingImages
          existingImages: variantImages,
          // Also provide previews for existing images
          previews: variantImages.map(img => img.url),
          // For backward compatibility
          image: primaryImage?.url || null,
          images: variantImages,
          isSaved: true,
          isNew: false,
          isModified: false,
        };
      });
      
      console.log("Formatted variants with images:", formattedVariants);
      setExistingVariants(formattedVariants);
      
      // If VariantSection ref is available, pass variants to it
      if (variantRef.current && variantRef.current.setVariants) {
        variantRef.current.setVariants(formattedVariants);
      }
    }

    // Handle category hierarchy
    if (product.category?.parent_id) {
      setParentCategory(product.category.parent_id);
      fetchSubcategories({ url: `/categories/${product.category.parent_id}/children`, force: true })
        .then(res => {
          const children = res?.data || [];
          setSubcategories(children);
          setForm(prev => ({ ...prev, category_id: product.category_id }));
          if (product.category_id) {
            fetchBrandsByCategory(product.category_id);
          }
        });
    } else {
      setParentCategory(product.category?.id || "");
      setForm(prev => ({ ...prev, category_id: product.category_id || "" }));
      if (product.category_id) {
        fetchBrandsByCategory(product.category_id);
      }
    }
  }, [product]);

  // Map variant attributes to selected values for AttributeSelector
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
    const id = e.target.value;
    setParentCategory(id);
    setForm(prev => ({
      ...prev,
      category_id: "",
      brand_id: "",
    }));
    setBrands([]);

    if (!id) {
      setSubcategories([]);
      return;
    }

    try {
      const res = await fetchSubcategories({
        url: `/categories/${id}/children`,
        force: true,
      });
      const children = res?.data || [];
      setSubcategories(children);

      if (children.length === 0) {
        setForm(prev => ({
          ...prev,
          category_id: id
        }));
        await fetchBrandsByCategory(id);
      }
    } catch (err) {
      console.error(err);
      setSubcategories([]);
      setForm(prev => ({
        ...prev,
        category_id: id
      }));
      await fetchBrandsByCategory(id);
    }
  };

  const handleSubcategoryChange = async (e) => {
    const subId = e.target.value;
    setForm(prev => ({
      ...prev,
      category_id: subId,
      brand_id: "",
    }));
    await fetchBrandsByCategory(subId);
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
      existingImages: [],
      isSaved: false,
      isNew: true,
      isModified: false,
    }));
  };

  const handleConfirmVariants = (selected) => {
    const attributes = attributeData?.data || [];
    const generated = generateVariants(selected, attributes);

    // Merge with existing variants - preserve existing data including images
    const mergedVariants = generated.map(newVariant => {
      const existingVariant = existingVariants.find(ev => ev.sku === newVariant.sku);
      if (existingVariant) {
        return {
          ...newVariant,
          price: existingVariant.price || newVariant.price,
          stock: existingVariant.stock || newVariant.stock,
          weight: existingVariant.weight || newVariant.weight,
          barcode: existingVariant.barcode || newVariant.barcode,
          discount_price: existingVariant.discount_price || newVariant.discount_price,
          existingImages: existingVariant.existingImages || [],
          previews: existingVariant.previews || [],
          isSaved: existingVariant.isSaved || false,
        };
      }
      return newVariant;
    });

    setPendingVariants(mergedVariants);
    setActiveTab("variants");
  };

  const handleUpdate = async () => {
    // Validate basic info
    const selectedCategoryId = form.category_id || parentCategory;
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    try {
      const payload = {
        name: form.name,
        short_description: form.short_description,
        description: form.description,
        price: Number(form.price || 0),
        discount_price: Number(form.discount_price || 0),
        cost_price: Number(form.cost_price || 0),
        stock: Number(form.stock || 0),
        category_id: selectedCategoryId,
        brand_id: form.brand_id || null,
        weight: Number(form.weight || 0),
        length: Number(form.length || 0),
        width: Number(form.width || 0),
        height: Number(form.height || 0),
        is_featured: form.is_featured ? 1 : 0,
        specifications: specifications.length ? specifications : null,
        approval_status: "pending",
      };

      await putData({ url: `/vendor/products/${productId}`, data: payload });

      toast.success("Product Updated Successfully ✅");
      onSuccess?.();
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
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent transition text-sm sm:text-base" 
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Short Description</label>
                <input 
                  name="short_description" 
                  value={form.short_description} 
                  onChange={handleChange} 
                  placeholder="Brief description (max 150 characters)"
                  maxLength={150}
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent transition text-sm sm:text-base" 
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Full Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows="4" 
                  placeholder="Detailed product description"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent transition text-sm sm:text-base" 
                />
              </div>

              {/* Category & Subcategory Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={parentCategory} 
                    onChange={handleCategoryChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent bg-white text-sm sm:text-base"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Subcategory
                    {subcategories.length > 0 && (
                      <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    )}
                  </label>
                  <select 
                    value={form.category_id} 
                    onChange={handleSubcategoryChange} 
                    disabled={!parentCategory || subcategories.length === 0}
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-sm sm:text-base"
                  >
                    <option value="">
                      {!parentCategory 
                        ? "Select category first" 
                        : subcategories.length 
                          ? "Select Subcategory (Optional)" 
                          : "No subcategories available"
                      }
                    </option>
                    {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {parentCategory && subcategories.length === 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      ℹ️ This category has no subcategories
                    </p>
                  )}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Brand <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <select
                  name="brand_id"
                  value={form.brand_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-sm sm:text-base"
                  disabled={loadingBrands || !form.category_id}
                >
                  <option value="">
                    {!form.category_id 
                      ? "Select category first" 
                      : loadingBrands 
                        ? "Loading brands..." 
                        : "Select Brand (Optional)"
                    }
                  </option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {form.category_id && brands.length === 0 && !loadingBrands && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ No brands available for this category
                  </p>
                )}
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      value={form.price} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Discounted Price
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      name="discount_price" 
                      type="number" 
                      step="0.01" 
                      value={form.discount_price} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Cost Price
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      name="cost_price" 
                      type="number" 
                      step="0.01" 
                      value={form.cost_price} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                    />
                  </div>
                </div>
              </div>

              {/* Stock & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Stock Quantity</label>
                  <input 
                    name="stock" 
                    type="number" 
                    value={form.stock} 
                    onChange={handleChange} 
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Length (cm)</label>
                  <input 
                    name="length" 
                    type="number" 
                    step="0.01" 
                    value={form.length} 
                    onChange={handleChange} 
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Width (cm)</label>
                  <input 
                    name="width" 
                    type="number" 
                    step="0.01" 
                    value={form.width} 
                    onChange={handleChange} 
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Height (cm)</label>
                  <input 
                    name="height" 
                    type="number" 
                    step="0.01" 
                    value={form.height} 
                    onChange={handleChange} 
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Weight (kg)</label>
                  <input 
                    name="weight" 
                    type="number" 
                    step="0.01" 
                    value={form.weight} 
                    onChange={handleChange} 
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base" 
                  />
                </div>
              </div>

              {/* Featured Product */}
              <div className="border-t pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_featured" 
                    checked={form.is_featured} 
                    onChange={handleChange} 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a1c3d] focus:ring-[#7a1c3d]" 
                  />
                  <span className="text-sm sm:text-base text-gray-700">⭐ Feature this product</span>
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
              }}
            />
          )}

          {activeTab === "specifications" && (
            <ProductSpecifications
              productId={productId}
              isLocked={false}
              specifications={specifications}
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
                onVariantsLoaded={(variants) => {
                  console.log("Variants loaded in VariantSection:", variants);
                  setExistingVariants(variants);
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium order-2 sm:order-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate} 
            className="bg-[#7a1c3d] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#5e132f] transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={updating}
          >
            <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
            {updating ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;