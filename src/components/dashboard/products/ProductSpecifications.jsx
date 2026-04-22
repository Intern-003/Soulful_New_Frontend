import React, { useState, useEffect } from 'react';
import useGet from '../../../api/hooks/useGet';
import usePut from '../../../api/hooks/usePut';
import { Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductSpecifications = ({ productId, isLocked = false, onSpecificationsChange }) => {
  const { data, refetch, loading: fetching } = useGet(`/vendor/products/${productId}`);
  const { putData, loading: updating } = usePut();

  const [specifications, setSpecifications] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', value: '' });

  // ✅ Load specifications when data changes
  useEffect(() => {
    if (data?.data?.specifications) {
      //console.log("Loading specifications:", data.data.specifications);
      setSpecifications(data.data.specifications);
      if (onSpecificationsChange) {
        onSpecificationsChange(data.data.specifications);
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.value.trim()) {
      toast.error('Please fill in both name and value');
      return;
    }

    try {
      // Get current specifications
      const currentSpecs = [...specifications];
      const newSpec = { 
        name: formData.name, 
        value: formData.value,
        // Temporary ID for UI update
        tempId: Date.now()
      };
      
      // ✅ Optimistic update - add to UI immediately
      const updatedSpecs = [...currentSpecs, newSpec];
      setSpecifications(updatedSpecs);
      
      if (onSpecificationsChange) {
        onSpecificationsChange(updatedSpecs);
      }
      
      // Send to backend (without tempId)
      const specsToSave = updatedSpecs.map(spec => ({
        name: spec.name,
        value: spec.value
      }));
      
      await putData({
        url: `/vendor/products/${productId}`,
        data: { specifications: specsToSave }
      });
      
      toast.success('Specification added successfully');
      setIsAdding(false);
      setFormData({ name: '', value: '' });
      
      // ✅ Refetch to get real IDs from backend
      await refetch();
      
    } catch (error) {
      console.error('Add error:', error);
      // Revert on error
      setSpecifications(specifications);
      toast.error(error?.response?.data?.message || 'Failed to add specification');
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.value.trim()) {
      toast.error('Please fill in both name and value');
      return;
    }

    try {
      // Update local state immediately
      const updatedSpecs = specifications.map(spec => 
        spec.id === editingId || spec.tempId === editingId 
          ? { ...spec, name: formData.name, value: formData.value }
          : spec
      );
      
      setSpecifications(updatedSpecs);
      
      if (onSpecificationsChange) {
        onSpecificationsChange(updatedSpecs);
      }
      
      // Send to backend
      const specsToSave = updatedSpecs.map(spec => ({
        name: spec.name,
        value: spec.value
      }));
      
      await putData({
        url: `/vendor/products/${productId}`,
        data: { specifications: specsToSave }
      });
      
      toast.success('Specification updated successfully');
      setEditingId(null);
      setFormData({ name: '', value: '' });
      
      // Refetch to get latest data
      await refetch();
      
    } catch (error) {
      console.error('Update error:', error);
      // Revert on error
      await refetch();
      toast.error('Failed to update specification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specification?')) return;
    
    try {
      // Remove from local state immediately
      const updatedSpecs = specifications.filter(spec => (spec.id !== id) && (spec.tempId !== id));
      setSpecifications(updatedSpecs);
      
      if (onSpecificationsChange) {
        onSpecificationsChange(updatedSpecs);
      }
      
      // Send to backend
      const specsToSave = updatedSpecs.map(spec => ({
        name: spec.name,
        value: spec.value
      }));
      
      await putData({
        url: `/vendor/products/${productId}`,
        data: { specifications: specsToSave }
      });
      
      toast.success('Specification deleted successfully');
      
      // Refetch to ensure consistency
      await refetch();
      
    } catch (error) {
      console.error('Delete error:', error);
      // Revert on error
      await refetch();
      toast.error('Failed to delete specification');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', value: '' });
  };

  // Show loading state
  if (fetching && specifications.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a1c3d]"></div>
        <span className="ml-2 text-gray-600">Loading specifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            📋 Product Specifications
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add detailed specifications like dimensions, material, warranty, etc.
            <span className="text-xs text-gray-400 ml-2">({specifications.length} added)</span>
          </p>
        </div>
        
        {!isLocked && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Add Specification
          </button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && !isLocked && (
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border-2 border-[#7a1c3d] shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Specification name (e.g., Brand, Warranty)"
              className="border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
              autoFocus
            />
            <input
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="Specification value (e.g., 2 Years, Stainless Steel)"
              className="border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!formData.name.trim() || !formData.value.trim() || updating}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save Specification
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Specifications List - Card View */}
      {specifications.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 sm:p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 font-medium">No specifications added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Specification" to get started</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications.map((spec) => (
              <div
                key={spec.id || spec.tempId}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200 group"
              >
                {(editingId === spec.id || editingId === spec.tempId) ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 text-sm w-full focus:ring-2 focus:ring-[#7a1c3d] outline-none"
                      placeholder="Specification name"
                      autoFocus
                    />
                    <input
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 text-sm w-full focus:ring-2 focus:ring-[#7a1c3d] outline-none"
                      placeholder="Specification value"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        disabled={updating}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        {updating ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <Save size={14} />
                        )}
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {spec.name}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1 break-words">
                          {spec.value}
                        </p>
                      </div>
                      {!isLocked && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(spec.id || spec.tempId);
                              setFormData({ name: spec.name, value: spec.value });
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(spec.id || spec.tempId)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {spec.id && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          Added: {new Date(spec.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">
              Total {specifications.length} specification(s) added
            </p>
          </div>
        </>
      )}

      {/* Updating Overlay */}
      {updating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7a1c3d]"></div>
            <span>Saving specifications...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;