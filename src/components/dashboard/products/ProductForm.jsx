// src/components/dashboard/products/ProductForm.jsx
import React, { useState, useEffect, useRef } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";
import usePermissions from "../../../api/hooks/usePermissions";
import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import ProductSpecifications from "./ProductSpecifications";
import { 
  X, Upload, Save, AlertCircle, CheckCircle, Image as ImageIcon, 
  Package, Settings, Tag, ChevronRight, ChevronLeft, 
  DollarSign, Truck, Shield, Trash2, RefreshCw 
} from "lucide-react";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/getImageUrl";

const ProductForm = ({ data, onClose, onSuccess }) => {
  const isEdit = !!data;
  const { can } = usePermissions();
  
  // Check permissions
  const canCreateProduct = can('product', 'create');
  const canEditProduct = can('product', 'update');
  
  const { data: categoryData } = useGet("/categories");
  const { data: attributeData } = useGet("/admin/attributes-with-values");
  const { refetch: fetchSubcategories } = useGet("/categories/placeholder", { autoFetch: false });
  
  const [subcategories, setSubcategories] = useState([]);
  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

  const variantRef = useRef(null);
  const [pendingVariants, setPendingVariants] = useState([]);
  const [existingVariants, setExistingVariants] = useState([]);
  const [productId, setProductId] = useState(data?.id || null);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProductSaved, setIsProductSaved] = useState(!!data);
  const [specifications, setSpecifications] = useState([]);
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [deletingImage, setDeletingImage] = useState(false);

  // Get currency symbol
  const getCurrencySymbol = () => '₹';
  const currencySymbol = getCurrencySymbol();

  const [form, setForm] = useState({
    name: "", short_description: "", description: "", price: "", discount_price: "",
    cost_price: "", stock: "", category_id: "", brand_id: "", weight: "", length: "",
    width: "", height: "", tax_rate: "", shipping_mode: "vendor", shipping_charge: "",
    is_featured: false,
  });

  const [parentCategory, setParentCategory] = useState("");
  
  // Image states - support both new and existing images
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Cleanup preview URLs on unmount
  useEffect(() => () => preview.forEach(url => URL.revokeObjectURL(url)), [preview]);

  // Load existing images when editing
  useEffect(() => {
    if (data && data.images) {
      // Filter product images (not variant images)
      const productImages = data.images.filter(img => {
        const isVariantImage = img.variant_id !== null && img.variant_id !== undefined;
        const url = img.image_url || '';
        const hasVariantInUrl = url.includes('/variants/') || url.includes('variant');
        return !isVariantImage && !hasVariantInUrl;
      });
      setExistingImages(productImages);
    }
  }, [data]);

  // Load product data
  useEffect(() => {
    if (!data) return;

    setForm({
      name: data.name || "",
      short_description: data.short_description || "",
      description: data.description || "",
      price: data.price ?? "",
      discount_price: data.discount_price ?? "",
      cost_price: data.cost_price ?? "",
      stock: data.stock ?? "",
      category_id: data.category_id || "",
      brand_id: data.brand_id || "",
      weight: data.weight || "",
      length: data.length || "",
      width: data.width || "",
      height: data.height || "",
      tax_rate: data.tax_rate ?? "",
      shipping_mode: data.shipping_mode || "vendor",
      shipping_charge: data.shipping_charge ?? "",
      is_featured: !!data.is_featured,
    });
    setParentCategory(data?.category?.parent_id || "");
    setProductId(data.id);
    setIsProductSaved(true);
    setSpecifications(data.specifications || []);
  }, [data]);

  useEffect(() => {
    if (generatedVariants.length) {
      variantRef.current?.addVariants(generatedVariants);
      setGeneratedVariants([]);
    }
  }, [generatedVariants]);

  const fetchBrandsByCategory = async (categoryId) => {
    if (!categoryId) {
      setBrands([]);
      return;
    }
    setLoadingBrands(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/brands/category/${categoryId}`);
      const data = await res.json();
      setBrands(data?.data || []);
    } catch (err) {
      console.error("Brand fetch error:", err);
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setParentCategory(id);
    setForm(prev => ({ ...prev, category_id: "", brand_id: "" }));
    setBrands([]);

    if (!id) {
      setSubcategories([]);
      return;
    }

    try {
      const res = await fetchSubcategories({ url: `/categories/${id}/children`, force: true });
      const children = res?.data || [];
      setSubcategories(children);

      if (children.length > 0) {
        return;
      }

      setForm(prev => ({ ...prev, category_id: id }));
      await fetchBrandsByCategory(id);
    } catch (err) {
      console.error(err);
      setSubcategories([]);
      setForm(prev => ({ ...prev, category_id: id }));
      await fetchBrandsByCategory(id);
    }
  };

  const handleSubcategoryChange = async (e) => {
    const subId = e.target.value;
    setForm(prev => ({ ...prev, category_id: subId, brand_id: "" }));
    await fetchBrandsByCategory(subId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numberFields = ["price", "discount_price", "cost_price", "stock", "length", "width", "height", "weight", "tax_rate", "shipping_charge"];
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : numberFields.includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    setPreview(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    e.target.value = null;
  };

  // Remove new image (not yet uploaded)
  const removeNewImage = (index) => {
    URL.revokeObjectURL(preview[index]);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing image (already uploaded)
  const removeExistingImage = async (imageId) => {
    if (!productId) {
      toast.error("Product not found");
      return;
    }
    if (!window.confirm("Are you sure you want to remove this image?")) return;

    setDeletingImage(true);
    try {
      await deleteData({ url: `/vendor/products/images/${imageId}` });
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success("Image removed successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove image");
    } finally {
      setDeletingImage(false);
    }
  };

  const validateBasicInfo = () => {
    const selectedCategoryId = form.category_id || parentCategory;

    if (!form.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (form.tax_rate && (form.tax_rate < 0 || form.tax_rate > 100)) {
      toast.error("Tax rate must be between 0 and 100");
      return false;
    }
    return true;
  };

  // ✅ FIXED: Create/Update product with proper step navigation
  const createProduct = async () => {
    if (submitting || isProductSaved) return;
    if (!validateBasicInfo()) return;
    
    if (!isEdit && !canCreateProduct) {
      toast.error("You don't have permission to create products");
      return;
    }
    if (isEdit && !canEditProduct) {
      toast.error("You don't have permission to edit products");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.name,
      short_description: form.short_description,
      description: form.description,
      price: Number(form.price || 0),
      discount_price: Number(form.discount_price || 0),
      cost_price: Number(form.cost_price || 0),
      stock: Number(form.stock || 0),
      category_id: form.category_id || parentCategory,
      brand_id: form.brand_id || null,
      weight: Number(form.weight || 0),
      length: Number(form.length || 0),
      width: Number(form.width || 0),
      height: Number(form.height || 0),
      tax_rate: form.tax_rate ? Number(form.tax_rate) : null,
      shipping_mode: form.shipping_mode,
      shipping_charge: form.shipping_charge ? Number(form.shipping_charge) : null,
      is_featured: form.is_featured ? 1 : 0,
      specifications: specifications.length ? specifications : null
    };

    try {
      if (isEdit) {
        await putData({ url: `/vendor/products/${data.id}`, data: payload });
        toast.success("Product updated successfully");
        setIsProductSaved(true);
        
        // ✅ If there are new images, go to images step, else go to specifications
        if (newImages.length > 0) {
          setCurrentStep(2);
        } else {
          setCurrentStep(3);
        }
        return;
      }

      // ✅ Create new product
      const res = await postData({ url: "/vendor/products", data: payload });
      setProductId(res?.data?.data?.id || res?.data?.id);
      setIsProductSaved(true);
      toast.success("Product created successfully! Now add images");
      setCurrentStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving product");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Upload images with proper step navigation
  const uploadProductImages = async () => {
    if (!productId) {
      toast.error("Product not found");
      return false;
    }

    if (!newImages.length) {
      // ✅ No new images, move to specifications
      setCurrentStep(3);
      return true;
    }

    setUploadingImages(true);
    try {
      const fd = new FormData();
      newImages.forEach(file => fd.append("images[]", file));
      fd.append("is_primary", 0);

      await postData({
        url: `/vendor/products/${productId}/images`,
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${newImages.length} image(s) uploaded successfully`);
      setNewImages([]);
      setPreview([]);
      
      // ✅ Move to specifications step (NO unnecessary refetch)
      setCurrentStep(3);
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error uploading images");
      return false;
    } finally {
      setUploadingImages(false);
    }
  };

  // ✅ FIXED: Next step handler with proper flow
  const handleNextStep = () => {
    if (currentStep === 1) {
      // ✅ Create or update product
      createProduct();
    } else if (currentStep === 2) {
      // ✅ Upload images
      uploadProductImages();
    } else if (currentStep === 3) {
      // ✅ Move to attributes
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // ✅ Handle attribute selection
      const hasSelectedAttributes = Object.values(selectedAttributeValues).some(arr => arr?.length > 0);
      if (hasSelectedAttributes) {
        // ✅ Generate variants and move to variant step
        handleConfirmVariants();
      } else {
        // ✅ No attributes selected, move directly to complete
        handleFinalSubmit();
      }
    }
  };

  const generateVariants = (selectedValues, attributesList) => {
    const selectedAttributes = attributesList.filter(attr => selectedValues[attr.id]?.length > 0);
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

  const handleConfirmVariants = () => {
    const attributes = attributeData?.data || [];
    const generated = generateVariants(selectedAttributeValues, attributes);

    if (generated.length === 0) {
      toast.error("Please select at least one attribute value");
      return;
    }

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

    setGeneratedVariants(mergedVariants);
    setCurrentStep(5);
  };

  const handleFinalSubmit = async () => {
    const hasSelectedAttributes = Object.values(selectedAttributeValues).some(arr => arr?.length > 0);
    const hasVariants = variantRef.current?.hasVariants?.();
    const unsavedVariants = variantRef.current?.getUnsavedVariants?.();

    if (hasSelectedAttributes && (!hasVariants || unsavedVariants?.length > 0)) {
      toast.error("Please save all variants before finalizing");
      return;
    }

    toast.success(isEdit ? "Product updated successfully! ✅" : "Product setup completed successfully! ✅");
    
    // ✅ Call onSuccess without unnecessary refetch
    if (onSuccess) {
      onSuccess();
    }
    
    setTimeout(onClose, 1500);
  };

  const categories = categoryData?.data || [];
  const attributes = attributeData?.data || [];

  const steps = [
    { number: 1, title: "Basic Info", icon: Package },
    { number: 2, title: "Images", icon: ImageIcon },
    { number: 3, title: "Specifications", icon: Tag },
    { number: 4, title: "Attributes & Variants", icon: Settings },
    { number: 5, title: "Review Variants", icon: Package },
  ];

  // If user doesn't have permission to create/edit, show error
  if (!isEdit && !canCreateProduct) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to create products.</p>
          <button onClick={onClose} className="px-6 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e132f] transition">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isEdit && !canEditProduct) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to edit products.</p>
          <button onClick={onClose} className="px-6 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e132f] transition">
            Close
          </button>
        </div>
      </div>
    );
  }

  // Calculate total images for display
  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7a1c3d] to-[#9b2c4f] px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isEdit ? "✏️ Edit Product" : "✨ Create New Product"}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 border-b">
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base
                    ${currentStep >= step.number ? 'bg-[#7a1c3d] text-white' : 'bg-gray-200 text-gray-500'}
                    ${currentStep > step.number ? 'ring-4 ring-[#7a1c3d]/30' : ''}`}>
                    {currentStep > step.number ? <CheckCircle size={16} className="sm:w-5 sm:h-5" /> : step.number}
                  </div>
                  <div className="text-xs mt-2 font-medium text-center hidden sm:block">{step.title}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 hidden sm:block
                    ${currentStep > step.number ? 'bg-[#7a1c3d]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="sm:hidden text-center mt-2 text-sm text-gray-600">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ========================================== */}
          {/* STEP 1: BASIC INFO */}
          {/* ========================================== */}
          {currentStep === 1 && (
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
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

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
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {parentCategory && subcategories.length === 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      ℹ️ This category has no subcategories
                    </p>
                  )}
                </div>
              </div>

              {/* Brand Row */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Brand <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <select
                  name="brand_id"
                  value={form.brand_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent disabled:bg-gray-100 bg-white text-sm sm:text-base"
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
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Tax & Shipping Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-[#7a1c3d]" />
                  Tax & Shipping Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Tax Rate (%)
                      <span className="text-xs text-gray-500 ml-1">(Optional, default 18%)</span>
                    </label>
                    <div className="relative">
                      <input
                        name="tax_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={form.tax_rate}
                        onChange={handleChange}
                        placeholder="18"
                        className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">GST/VAT applicable on this product</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Shipping Mode
                      <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </label>
                    <select
                      name="shipping_mode"
                      value={form.shipping_mode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent bg-white text-sm sm:text-base"
                    >
                      <option value="vendor">Vendor Shipping</option>
                      <option value="marketplace">Marketplace Shipping</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {form.shipping_mode === 'vendor' 
                        ? 'Vendor handles shipping and delivery' 
                        : 'Marketplace handles shipping and delivery'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Shipping Charge
                      <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                      <input
                        name="shipping_charge"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.shipping_charge}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-lg p-2.5 pl-7 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Additional shipping cost if applicable</p>
                  </div>
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
                  <span className="font-medium text-sm sm:text-base text-gray-700">
                    ⭐ Feature this product
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 2: IMAGES */}
          {/* ========================================== */}
          {currentStep === 2 && (
            <div>
              {/* Show existing images when editing */}
              {isEdit && existingImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base text-gray-700">
                    Existing Images ({existingImages.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={getImageUrl(img.image_url)}
                          className="h-24 sm:h-32 w-full object-cover rounded-lg shadow-md"
                          alt="Existing product"
                        />
                        <button
                          onClick={() => removeExistingImage(img.id)}
                          disabled={deletingImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg disabled:opacity-50"
                        >
                          {deletingImage ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} className="sm:w-4 sm:h-4" />
                          )}
                        </button>
                        {img.is_primary && (
                          <span className="absolute bottom-1 left-1 bg-[#7a1c3d] text-white text-xs px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload new images */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition cursor-pointer bg-gray-50 hover:bg-gray-100
                  ${isEdit ? 'border-blue-300 hover:border-blue-500' : 'border-gray-300 hover:border-[#7a1c3d]'}`}
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <div className="flex flex-col items-center">
                  <Upload size={32} className="sm:w-12 sm:h-12 text-gray-400 mb-3" />
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    {isEdit ? 'Add Additional Images' : 'Click to upload product images'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  {isEdit && (
                    <p className="text-xs text-blue-600 mt-2">
                      💡 You can upload additional images without removing existing ones
                    </p>
                  )}
                </div>
              </div>

              {/* New images preview */}
              {preview.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base text-gray-700">
                    New Images to Upload ({preview.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {preview.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          className="h-24 sm:h-32 w-full object-cover rounded-lg shadow-md"
                          alt={`Preview ${i}`}
                        />
                        <button
                          onClick={() => removeNewImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X size={12} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image count summary */}
              {isEdit && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Total Images:</strong> {totalImages} 
                    ({existingImages.length} existing + {newImages.length} new)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 3: SPECIFICATIONS */}
          {/* ========================================== */}
          {currentStep === 3 && productId && (
            <ProductSpecifications
              productId={productId}
              isLocked={false}
              specifications={specifications}
              onSpecificationsChange={setSpecifications}
            />
          )}

          {/* ========================================== */}
          {/* STEP 4: ATTRIBUTES */}
          {/* ========================================== */}
          {currentStep === 4 && (
            <AttributeSelector
              selected={selectedAttributeValues}
              onChange={setSelectedAttributeValues}
              attributes={attributes}
              onConfirmVariants={handleConfirmVariants}
            />
          )}

          {/* ========================================== */}
          {/* STEP 5: VARIANTS */}
          {/* ========================================== */}
          {currentStep === 5 && productId && (
            <VariantSection
              ref={variantRef}
              productId={productId}
              onVariantsLoaded={setExistingVariants}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              }
            }}
            className={`px-4 sm:px-6 py-2 border border-gray-300 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium
              ${currentStep === 1 ? 'invisible' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium"
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNextStep}
                disabled={
                  submitting ||
                  uploadingImages ||
                  (currentStep === 1 && isProductSaved && !isEdit) ||
                  (currentStep === 4 && !(form.category_id || parentCategory))
                }
                className="bg-[#7a1c3d] text-white px-6 sm:px-8 py-2 rounded-lg hover:bg-[#5e132f] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                {currentStep === 1 && !isProductSaved && !isEdit ? (submitting ? "Creating..." : "Create Product")
                  : currentStep === 2 ? (uploadingImages ? "Uploading..." : "Upload Images")
                    : currentStep === 4 ? "Select Attributes" : "Next"}
                {currentStep !== 4 && <ChevronRight size={16} />}
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="bg-green-600 text-white px-6 sm:px-8 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                <CheckCircle size={16} /> Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;