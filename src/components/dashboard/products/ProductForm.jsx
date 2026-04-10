import React, { useState, useEffect, useRef } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";
import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import VariantGenerator from "./VariantGenerator";
import ProductSpecifications from "./ProductSpecifications";
import { X, Upload, Save, AlertCircle, CheckCircle, Image as ImageIcon, Package, Settings, Tag, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const ProductForm = ({ data, onClose, onSuccess }) => {
  const isEdit = !!data;
  const { data: categoryData } = useGet("/categories");
  const { data: brandData } = useGet("/brands");
  const { data: attributeData } = useGet("/admin/attributes-with-values");
  const { data: subcategoryData, refetch: refetchSubcategories } = useGet("", { autoFetch: false });
  const { postData } = usePost();
  const { putData } = usePut();

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

  const [form, setForm] = useState({
    name: "", short_description: "", description: "", price: "", discount_price: "",
    cost_price: "", stock: "", category_id: "", brand_id: "", weight: "", length: "",
    width: "", height: "", is_featured: false,
  });

  const [parentCategory, setParentCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // Cleanup preview URLs on unmount
  useEffect(() => () => preview.forEach(url => URL.revokeObjectURL(url)), [preview]);

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
      is_featured: !!data.is_featured,
    });
    setParentCategory(data?.category?.parent_id || "");
    setProductId(data.id);
    setIsProductSaved(true);
    setSpecifications(data.specifications || []);
  }, [data]);

  useEffect(() => {
    if (pendingVariants.length) {
      variantRef.current?.addVariants(pendingVariants);
      setPendingVariants([]);
    }
  }, [pendingVariants]);

  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setParentCategory(id);
    setForm(prev => ({ ...prev, category_id: "" }));
    if (id) await refetchSubcategories({ url: `/categories/${id}/children` });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numberFields = ["price", "discount_price", "cost_price", "stock", "length", "width", "height", "weight"];
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : numberFields.includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setPreview(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(preview[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateBasicInfo = () => {
    if (!form.name.trim()) { toast.error("Product name is required"); return false; }
    if (!form.category_id) { toast.error("Please select a category"); return false; }
    if (!form.price || form.price <= 0) { toast.error("Valid price is required"); return false; }
    return true;
  };

  const createProduct = async () => {
    if (submitting || isProductSaved) return;
    if (!validateBasicInfo()) return;

    setSubmitting(true);
    const payload = {
      name: form.name,
      short_description: form.short_description,
      description: form.description,
      price: Number(form.price || 0),
      discount_price: Number(form.discount_price || 0),
      cost_price: Number(form.cost_price || 0),
      stock: Number(form.stock || 0),
      category_id: form.category_id,
      brand_id: form.brand_id || null,
      weight: Number(form.weight || 0),
      length: Number(form.length || 0),
      width: Number(form.width || 0),
      height: Number(form.height || 0),
      is_featured: form.is_featured ? 1 : 0,
      specifications: specifications.length ? specifications : null
    };

    try {
      if (isEdit) {
        await putData({ url: `/vendor/products/${data.id}`, data: payload });
        toast.success("Product updated successfully");
        onSuccess?.();
        onClose();
        return;
      }

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

  const uploadProductImages = async () => {
    if (!productId) {
      toast.error("Product not found");
      return false;
    }

    if (!images.length && !isEdit) {
      toast.error("Please select images to upload");
      return false;
    }

    if (!images.length && isEdit) {
      setCurrentStep(3);
      return true;
    }

    setUploadingImages(true);
    try {
      const fd = new FormData();
      images.forEach(file => fd.append("images[]", file));
      fd.append("is_primary", 1);

      await postData({
        url: `/vendor/products/${productId}/images`,
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${images.length} image(s) uploaded successfully`);
      setImages([]);
      setPreview([]);
      setCurrentStep(3);
      return true;
    } catch (err) {
      toast.error("Error uploading images");
      return false;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) createProduct();
    else if (currentStep === 2) uploadProductImages();
    else if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleFinalSubmit = async () => {
    const hasSelectedAttributes = Object.values(selectedAttributeValues).some(arr => arr?.length > 0);
    const hasVariants = variantRef.current?.hasVariants?.();
    const unsavedVariants = variantRef.current?.getUnsavedVariants?.();

    if (hasSelectedAttributes && (!hasVariants || unsavedVariants?.length > 0)) {
      toast.error("Please save all variants before finalizing");
      return;
    }

    toast.success("Product setup completed successfully! ✅");
    onSuccess?.();
    setTimeout(onClose, 1500);
  };

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data?.data || brandData?.data || [];
  const attributes = attributeData?.data || [];

  const steps = [
    { number: 1, title: "Basic Info", icon: Package },
    { number: 2, title: "Images", icon: ImageIcon },
    { number: 3, title: "Specifications", icon: Tag },
    { number: 4, title: "Attributes", icon: Settings },
    { number: 5, title: "Variants", icon: Package },
  ];

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
        {!isEdit && (
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
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter product name"
                  className="w-full border rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-[#7a1c3d] text-sm sm:text-base" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input name="short_description" value={form.short_description} onChange={handleChange} placeholder="Brief description"
                  className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4"
                  placeholder="Detailed product description" className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
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
              <div><label className="block text-sm font-medium mb-1">Price *</label><input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" className="w-full border rounded-lg p-2 sm:p-3" /></div>
              <div><label className="block text-sm font-medium mb-1">Discount Price</label><input name="discount_price" type="number" value={form.discount_price} onChange={handleChange} placeholder="0.00" className="w-full border rounded-lg p-2 sm:p-3" /></div>
              <div><label className="block text-sm font-medium mb-1">Cost Price</label><input name="cost_price" type="number" value={form.cost_price} onChange={handleChange} placeholder="0.00" className="w-full border rounded-lg p-2 sm:p-3" /></div>
              <div><label className="block text-sm font-medium mb-1">Stock Quantity</label><input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" className="w-full border rounded-lg p-2 sm:p-3" /></div>
              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <div><label className="block text-sm font-medium mb-1">Length (cm)</label><input name="length" type="number" value={form.length} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
                <div><label className="block text-sm font-medium mb-1">Width (cm)</label><input name="width" type="number" value={form.width} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
                <div><label className="block text-sm font-medium mb-1">Height (cm)</label><input name="height" type="number" value={form.height} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
                <div><label className="block text-sm font-medium mb-1">Weight (kg)</label><input name="weight" type="number" value={form.weight} onChange={handleChange} className="w-full border rounded-lg p-2 sm:p-3" /></div>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">⭐ Feature this product</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center hover:border-[#7a1c3d] transition cursor-pointer" onClick={() => document.getElementById('imageUpload')?.click()}>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="imageUpload" />
                <div className="flex flex-col items-center">
                  <Upload size={32} className="sm:w-12 sm:h-12 text-gray-400 mb-3" />
                  <p className="text-sm sm:text-base text-gray-600">Click to upload product images</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {preview.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Images to Upload ({preview.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {preview.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} className="h-24 sm:h-32 w-full object-cover rounded-lg" alt={`Preview ${i}`} />
                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                          <X size={12} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && productId && (
            <ProductSpecifications productId={productId} isLocked={false} onSpecificationsChange={setSpecifications} />
          )}

          {currentStep === 4 && (
            <AttributeSelector selected={selectedAttributeValues} onChange={setSelectedAttributeValues} attributes={attributes} />
          )}

          {currentStep === 5 && productId && (
            <div className="space-y-4 sm:space-y-6">
              <VariantGenerator attributes={attributes} selectedValues={selectedAttributeValues} onGenerated={setPendingVariants} disabled={!productId || submitting} existingVariants={existingVariants} />
              <VariantSection ref={variantRef} productId={productId} onVariantsLoaded={setExistingVariants} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-3 flex-shrink-0">
          <button onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)} className={`px-4 sm:px-6 py-2 border rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base
            ${currentStep === 1 ? 'invisible' : 'hover:bg-gray-100'}`}>
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onClose} className="px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-100 transition text-sm sm:text-base">Cancel</button>
            {currentStep < steps.length ? (
              <button onClick={handleNextStep} disabled={submitting || uploadingImages || (currentStep === 1 && isProductSaved && !isEdit)}
                className="bg-[#7a1c3d] text-white px-6 sm:px-8 py-2 rounded-lg hover:bg-[#5e132f] disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                {currentStep === 1 && !isProductSaved && !isEdit ? (submitting ? "Creating..." : "Create Product")
                  : currentStep === 2 ? (uploadingImages ? "Uploading..." : "Upload Images")
                  : <>Next <ChevronRight size={16} /></>}
              </button>
            ) : (
              <button onClick={handleFinalSubmit} className="bg-green-600 text-white px-6 sm:px-8 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base">
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