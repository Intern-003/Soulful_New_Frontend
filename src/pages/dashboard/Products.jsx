// src/pages/dashboard/Products.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";
import { getImageUrl } from "../../utils/getImageUrl";
import ProductForm from "../../components/dashboard/products/ProductForm";
import EditProductModal from "../../components/dashboard/products/EditProductModal";
import AttributeManager from "../../components/dashboard/products/AttributeManager";
import usePermissions from "../../api/hooks/usePermissions";
import {
  Settings,
  CheckCircle,
  XCircle,
  Power,
  PowerOff,
  RefreshCw,
  CheckSquare,
  Square,
  Pencil  // 👈 Replace DollarSign with Percent
} from "lucide-react";
import toast from "react-hot-toast";

// Constants
const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const COMMISSION_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

const Products = () => {
  // ========================================
  // PERMISSIONS & AUTH
  // ========================================
  const { can, canAny } = usePermissions();
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const isAdmin = role === 'admin' || role === 'Admin';

  // Permission checks
  const permissions = useMemo(() => ({
    canViewAllProducts: can('product', 'view_all') || isAdmin,
    canApproveProducts: can('product', 'approve') || isAdmin,
    canUpdateProducts: can('product', 'update') || isAdmin,
    canDeleteProducts: can('product', 'delete') || isAdmin,
    canManageCommission: can('commission', 'update') || isAdmin,
    canViewCommission: can('commission', 'view') || isAdmin,
    canViewVendorEarnings: can('vendor', 'earnings_view') || isAdmin,
    canBulkApprove: can('product', 'bulk_approve') || isAdmin,
    canViewVendors: can('vendor', 'view') || isAdmin,
  }), [can, isAdmin]);

  // ========================================
  // API HOOKS
  // ========================================
  const apiEndpoint = isAdmin ? "/admin/products" : "/vendor/products";
  const { data, loading, error, refetch } = useGet(apiEndpoint);
  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();
  const { data: vendorsData, loading: vendorsLoading } = useGet("/admin/vendors");

  // ========================================
  // STATE
  // ========================================
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAttributeManager, setShowAttributeManager] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Modal states
  const [approvalModal, setApprovalModal] = useState({ open: false, product: null, action: null });
  const [bulkModal, setBulkModal] = useState({ open: false, action: null });
  const [commissionModal, setCommissionModal] = useState({ open: false, product: null });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    stockFilter: "",
    approvalFilter: "",
    statusFilter: "",
    vendorFilter: ""
  });

  const [page, setPage] = useState(1);
  const isInitialLoad = useRef(true);

  // ========================================
  // DATA EXTRACTION
  // ========================================
  const products = data?.data?.data || [];
  const meta = data?.data;
  const vendors = vendorsData?.data || [];
  const currencySymbol = '₹';

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  const formatCurrency = useCallback((amount) => {
    if (amount === null || amount === undefined) return `${currencySymbol}0`;
    return `${currencySymbol}${parseFloat(amount).toFixed(2)}`;
  }, [currencySymbol]);

  const getVendorCreatorName = useCallback((product) => {
    if (product.vendor?.store_name) return product.vendor.store_name;
    if (product.user?.name) return product.user.name;
    return "N/A";
  }, []);

  const getVendorCreatorId = useCallback((product) => {
    return product.vendor?.id || null;
  }, []);

  const calculatePriceAfterCommission = useCallback((price, commission, commissionType = 'percentage') => {
    if (!price || price === 0) return 0;
    if (!commission || commission === 0) return parseFloat(price);

    if (commissionType === 'fixed') {
      const result = parseFloat(price) - parseFloat(commission);
      return result > 0 ? result : 0;
    }
    const commissionAmount = (parseFloat(price) * parseFloat(commission)) / 100;
    const result = parseFloat(price) - commissionAmount;
    return result > 0 ? result : 0;
  }, []);

  const calculateCommissionAmount = useCallback((price, commission, commissionType = 'percentage') => {
    if (!price || price === 0) return 0;
    if (!commission || commission === 0) return 0;

    if (commissionType === 'fixed') {
      return parseFloat(commission);
    }
    return (parseFloat(price) * parseFloat(commission)) / 100;
  }, []);

  // ========================================
  // EFFECTS
  // ========================================
  useEffect(() => {
    if (isInitialLoad.current) {
      setLocalProducts(products);
      isInitialLoad.current = false;
    } else if (JSON.stringify(localProducts) !== JSON.stringify(products)) {
      setLocalProducts(products);
    }
  }, [products, localProducts]);

  // ========================================
  // FILTERED PRODUCTS
  // ========================================
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(localProducts)) return [];

    return localProducts.filter((p) => {
      // Permission check - only show own products if not admin
      if (!isAdmin && !permissions.canViewAllProducts) {
        const vendorId = p.vendor?.id || p.vendor_id;
        const userId = p.user?.id || p.user_id;
        const currentUserId = user?.id;
        const currentVendorId = user?.vendor?.id;

        if (vendorId && vendorId !== currentVendorId) return false;
        if (userId && userId !== currentUserId) return false;
      }

      const matchesSearch = p.name?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStock = filters.stockFilter === "in" ? p.stock > 0
        : filters.stockFilter === "out" ? p.stock === 0
          : true;
      const matchesApproval = filters.approvalFilter === "approved" ? p.approval_status === "approved"
        : filters.approvalFilter === "pending" ? p.approval_status === "pending"
          : filters.approvalFilter === "rejected" ? p.approval_status === "rejected"
            : true;
      const matchesStatus = filters.statusFilter === "active" ? p.status === 1
        : filters.statusFilter === "inactive" ? p.status === 0
          : true;
      const matchesVendor = filters.vendorFilter ? getVendorCreatorId(p) == filters.vendorFilter : true;

      return matchesSearch && matchesStock && matchesApproval && matchesStatus && matchesVendor;
    });
  }, [localProducts, filters, isAdmin, permissions.canViewAllProducts, user, getVendorCreatorId]);

  // ========================================
  // COLUMN CONFIGURATION
  // ========================================
  const showBulkActions = permissions.canBulkApprove || isAdmin;
  const showCommissionColumn = permissions.canViewCommission || isAdmin;
  const showAdminEarnsColumn = permissions.canViewCommission || isAdmin;
  const showVendorEarnsColumn = permissions.canViewVendorEarnings || isAdmin;
  const showApprovalColumn = permissions.canApproveProducts || isAdmin;
  const showStatusColumn = permissions.canUpdateProducts || isAdmin;
  const showDeleteAction = permissions.canDeleteProducts || isAdmin;
  const showEditAction = permissions.canUpdateProducts || isAdmin;
  const showCommissionAction = permissions.canManageCommission || isAdmin;

  const columnCount = useMemo(() => {
    let count = 4; // Image, Name, Price, Vendor/Creator
    if (showBulkActions) count++;
    if (showCommissionColumn) count++;
    if (showAdminEarnsColumn) count++;
    if (showVendorEarnsColumn) count++;
    if (showApprovalColumn) count++;
    if (showStatusColumn) count++;
    count++; // Actions column
    count++; // Stock column
    return count;
  }, [showBulkActions, showCommissionColumn, showAdminEarnsColumn, showVendorEarnsColumn, showApprovalColumn, showStatusColumn]);

  // ========================================
  // BULK SELECTION HANDLERS
  // ========================================
  const toggleSelectAll = useCallback(() => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  }, [selectedProducts, filteredProducts]);

  const toggleSelectProduct = useCallback((id) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleBulkAction = useCallback((action) => {
    if (selectedProducts.size === 0) {
      toast.error(`Please select products to ${action}`);
      return;
    }
    setBulkModal({ open: true, action });
  }, [selectedProducts]);

  const handleBulkSubmit = useCallback(async ({ action, commission, commission_type, rejection_reason }) => {
    setBulkActionLoading(true);
    setBulkModal({ open: false, action: null });

    const isApprove = action === 'approve';

    // Optimistic update
    setLocalProducts(prev => Array.isArray(prev) ? prev.map(p =>
      selectedProducts.has(p.id) ? {
        ...p,
        approval_status: isApprove ? "approved" : "rejected",
        status: isApprove ? 1 : 0,
        commission: commission || p.commission,
        commission_type: commission_type || p.commission_type,
        rejection_reason: rejection_reason || p.rejection_reason,
      } : p
    ) : []);

    try {
      await postData({
        url: `/admin/products/bulk-toggle-approval`,
        data: {
          ids: Array.from(selectedProducts),
          action: action,
          commission: commission,
          commission_type: commission_type,
          rejection_reason: rejection_reason,
        }
      });

      toast.success(`${selectedProducts.size} product(s) ${action}d successfully`);
      setSelectedProducts(new Set());
      await refetch({ force: true });
    } catch (err) {
      await refetch({ force: true });
      const errorMessage = err?.response?.data?.message || err.message || `Failed to ${action} products`;
      toast.error(errorMessage);
    } finally {
      setBulkActionLoading(false);
    }
  }, [selectedProducts, postData, refetch]);

  // ========================================
  // APPROVAL HANDLERS
  // ========================================
  const handleApprovalChange = useCallback((productId, newStatus) => {
    if (!permissions.canApproveProducts && !isAdmin) {
      toast.error("You don't have permission to change approval status");
      return;
    }

    const product = Array.isArray(localProducts) ? localProducts.find(p => p.id === productId) : null;
    if (!product || product.approval_status === newStatus) return;

    if (newStatus === 'approved') {
      setApprovalModal({ open: true, product, action: 'approve' });
    } else if (newStatus === 'rejected') {
      setApprovalModal({ open: true, product, action: 'reject' });
    }
  }, [permissions.canApproveProducts, isAdmin, localProducts]);

  const handleApprovalSubmit = useCallback(async ({ product, action, commission, commission_type, rejection_reason }) => {
    setActionLoading(`approval-${product.id}`);

    try {
      await postData({
        url: `/admin/products/${product.id}/toggle-approval`,
        data: {
          action,
          commission,
          commission_type,
          rejection_reason,
        },
      });

      setLocalProducts(prev => Array.isArray(prev) ? prev.map(p =>
        p.id === product.id ? {
          ...p,
          approval_status: action === "approve" ? "approved" : "rejected",
          status: action === "approve" ? 1 : 0,
          commission: commission || p.commission,
          commission_type: commission_type || p.commission_type,
          rejection_reason: rejection_reason || p.rejection_reason,
        } : p
      ) : []);

      toast.success(`Product ${action}d successfully`);
      await refetch({ force: true });
    } catch (err) {
      await refetch({ force: true });
      const errorMessage = err?.response?.data?.message || err.message || "Failed to update approval status";
      toast.error(errorMessage);
    } finally {
      setApprovalModal({ open: false, product: null, action: null });
      setActionLoading(null);
    }
  }, [postData, refetch]);

  // ========================================
  // COMMISSION HANDLERS
  // ========================================
  const handleCommissionUpdate = useCallback(async (productId, commission, commissionType) => {
    if (!permissions.canManageCommission && !isAdmin) {
      toast.error("You don't have permission to update commission");
      return;
    }

    setActionLoading(`commission-${productId}`);
    try {
      await putData({
        url: `/admin/products/${productId}/commission`,
        data: {
          commission: commission,
          commission_type: commissionType
        }
      });

      setLocalProducts(prev => Array.isArray(prev) ? prev.map(p =>
        p.id === productId ? { ...p, commission, commission_type: commissionType } : p
      ) : []);

      toast.success("Commission updated successfully");
      setCommissionModal({ open: false, product: null });
      await refetch({ force: true });
    } catch (err) {
      await refetch({ force: true });
      const errorMessage = err?.response?.data?.message || err.message || "Failed to update commission";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  }, [permissions.canManageCommission, isAdmin, putData, refetch]);

  // ========================================
  // STATUS HANDLERS
  // ========================================
  const handleToggleStatus = useCallback(async (id, currentStatus) => {
    if (!permissions.canUpdateProducts && !isAdmin) {
      toast.error("You don't have permission to update product status");
      return;
    }

    setLocalProducts(prev => Array.isArray(prev) ? prev.map(p =>
      p.id === id ? { ...p, status: currentStatus === 1 ? 0 : 1 } : p
    ) : []);

    setActionLoading(`status-${id}`);
    try {
      await postData({
        url: `/admin/products/${id}/toggle-status`,
        data: {}
      });
      toast.success(currentStatus === 1 ? "Product deactivated" : "Product activated");
      await refetch({ force: true });
    } catch (err) {
      await refetch({ force: true });
      const errorMessage = err?.response?.data?.message || err.message || "Failed to update status";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  }, [permissions.canUpdateProducts, isAdmin, postData, refetch]);

  // ========================================
  // DELETE HANDLER
  // ========================================
  // In Products.jsx - Update the handleDelete function

  const handleDelete = useCallback(async (id) => {
    if (!permissions.canDeleteProducts && !isAdmin) {
      toast.error("You don't have permission to delete products");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    // Optimistic update
    setLocalProducts(prev => Array.isArray(prev) ? prev.filter(p => p.id !== id) : []);
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    try {
      // ✅ Use admin endpoint for admin, vendor endpoint for vendors
      const endpoint = isAdmin ? `/admin/products/${id}` : `/vendor/products/${id}`;
      await deleteData({ url: endpoint });
      toast.success("Product deleted successfully");
      await refetch({ force: true });
    } catch (err) {
      // Revert optimistic update on error
      await refetch({ force: true });
      const errorMessage = err?.response?.data?.message || err.message || "Failed to delete product";
      toast.error(errorMessage);
    }
  }, [permissions.canDeleteProducts, isAdmin, deleteData, refetch]);
  // ========================================
  // PAGINATION
  // ========================================
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    setSelectedProducts(new Set());
    refetch({ url: `${apiEndpoint}?page=${newPage}`, force: true });
  }, [apiEndpoint, refetch]);

  // ========================================
  // FILTER HANDLERS
  // ========================================
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  // ========================================
  // RENDER HELPER - Loading & Error States
  // ========================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  // ========================================
  // MODAL COMPONENTS
  // ========================================

  // Approval Modal
  const ApprovalModal = ({ product, action, onClose, onSubmit }) => {
    const [commission, setCommission] = useState(product?.commission || "");
    const [commissionType, setCommissionType] = useState(product?.commission_type || "percentage");
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
      if (action === "approve" && (!commission && commission !== 0)) {
        toast.error("Please enter commission");
        return;
      }
      if (action === "reject" && !reason.trim()) {
        toast.error("Please enter rejection reason");
        return;
      }

      onSubmit({
        product,
        action,
        commission: parseFloat(commission) || 0,
        commission_type: commissionType,
        rejection_reason: reason.trim(),
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {action === "approve" ? "Approve Product" : "Reject Product"}
            </h2>
            <p className="text-sm text-gray-600 mb-4 break-words">
              {action === "approve" ? "Approve:" : "Reject:"} {product?.name}
            </p>

            {action === "approve" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission {commissionType === 'fixed' ? `(${currencySymbol})` : '(%)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={commissionType === 'fixed' ? `Enter commission amount in ${currencySymbol}` : "Enter commission percentage"}
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({currencySymbol})</option>
                  </select>
                </div>
              </>
            )}

            {action === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter rejection reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition resize-none"
                  autoFocus
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e132f] transition font-medium"
              >
                {action === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk Approval Modal
  const BulkApprovalModal = ({ action, selectedCount, onClose, onSubmit }) => {
    const [commission, setCommission] = useState("");
    const [commissionType, setCommissionType] = useState("percentage");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (action === "approve" && (!commission && commission !== 0)) {
        toast.error("Please enter commission");
        return;
      }
      if (action === "reject" && !reason.trim()) {
        toast.error("Please enter rejection reason");
        return;
      }

      setIsSubmitting(true);
      await onSubmit({
        action,
        commission: parseFloat(commission) || 0,
        commission_type: commissionType,
        rejection_reason: reason.trim(),
      });
      setIsSubmitting(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {action === "approve" ? "Bulk Approve" : "Bulk Reject"} Products
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              You are about to {action} <span className="font-semibold text-[#7a1c3d]">{selectedCount}</span> product(s)
            </p>

            {action === "approve" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission {commissionType === 'fixed' ? `(${currencySymbol})` : '(%)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={commissionType === 'fixed' ? `Enter commission amount in ${currencySymbol}` : "Enter commission percentage for all products"}
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({currencySymbol})</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This commission will apply to all selected products
                </p>
              </>
            )}

            {action === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter rejection reason for all products"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will apply to all selected products
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e132f] transition font-medium flex items-center gap-2"
              >
                {isSubmitting && <RefreshCw size={16} className="animate-spin" />}
                {action === "approve" ? "Approve All" : "Reject All"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Commission Edit Modal
  const CommissionModal = ({ product, onClose, onSubmit }) => {
    const [commission, setCommission] = useState(product?.commission || "");
    const [commissionType, setCommissionType] = useState(product?.commission_type || "percentage");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sellingPrice = product?.discount_price || product?.price || 0;
    const vendorEarns = calculatePriceAfterCommission(sellingPrice, commission, commissionType);
    const adminEarns = calculateCommissionAmount(sellingPrice, commission, commissionType);

    const handleSubmit = async () => {
      if (!commission && commission !== 0) {
        toast.error("Please enter commission");
        return;
      }
      setIsSubmitting(true);
      await onSubmit(product.id, parseFloat(commission) || 0, commissionType);
      setIsSubmitting(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Commission</h2>
            <p className="text-sm text-gray-600 mb-4">Product: {product?.name}</p>
            <p className="text-sm text-gray-600 mb-4">Selling Price: {formatCurrency(sellingPrice)}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission {commissionType === 'fixed' ? `(${currencySymbol})` : '(%)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder={commissionType === 'fixed' ? `Enter commission amount in ${currencySymbol}` : "Enter commission percentage"}
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Type <span className="text-red-500">*</span>
              </label>
              <select
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ({currencySymbol})</option>
              </select>
            </div>

            {commission && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Admin Earns:</span>
                    <span className="font-medium text-green-600">{formatCurrency(adminEarns)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Vendor Earns:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(vendorEarns)}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e132f] transition font-medium flex items-center gap-2"
              >
                {isSubmitting && <RefreshCw size={16} className="animate-spin" />}
                Update Commission
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========================================
  // MAIN RENDER
  // ========================================
  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-[#7a1c3d]">Products</h1>

        <div className="flex flex-wrap gap-3">
          {(isAdmin || canAny('attribute')) && (
            <button
              onClick={() => setShowAttributeManager(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm sm:text-base"
            >
              <Settings size={18} />
              Manage Attributes
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition text-sm sm:text-base"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              {selectedProducts.size} product(s) selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('approve')}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-1 disabled:opacity-50"
            >
              {bulkActionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Bulk Approve
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50"
            >
              {bulkActionLoading ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
              Bulk Reject
            </button>
            <button
              onClick={() => setSelectedProducts(new Set())}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        />
        <select
          value={filters.stockFilter}
          onChange={(e) => handleFilterChange('stockFilter', e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <select
          value={filters.approvalFilter}
          onChange={(e) => handleFilterChange('approvalFilter', e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        >
          <option value="">All Approval</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.statusFilter}
          onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={filters.vendorFilter}
          onChange={(e) => handleFilterChange('vendorFilter', e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
          disabled={vendorsLoading}
        >
          <option value="">All Vendors</option>
          {Array.isArray(vendors) && vendors.map(vendor => (
            <option key={vendor.id} value={vendor.id}>{vendor.store_name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              {showBulkActions && (
                <th className="p-3 sm:p-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-600 hover:text-gray-800 transition"
                    aria-label={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0
                      ? "Deselect all products"
                      : "Select all products"}
                  >
                    {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
              )}
              <th className="p-3 sm:p-4">Image</th>
              <th className="p-3 sm:p-4">Name</th>
              <th className="p-3 sm:p-4">Price</th>
              {showCommissionColumn && <th className="p-3 sm:p-4">Commission</th>}
              {showAdminEarnsColumn && <th className="p-3 sm:p-4">Admin Earns</th>}
              {showVendorEarnsColumn && <th className="p-3 sm:p-4">Vendor Earns</th>}
              {permissions.canViewVendors && <th className="p-3 sm:p-4">Vendor/Creator</th>}
              <th className="p-3 sm:p-4">Stock</th>
              {showApprovalColumn && <th className="p-3 sm:p-4">Approval</th>}
              {showStatusColumn && <th className="p-3 sm:p-4">Status</th>}
              <th className="p-3 sm:p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="text-center p-8 text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const image = product?.images?.find((img) => img.is_primary)?.image_url ||
                  product?.images?.[0]?.image_url;

                const sellingPrice = product.discount_price || product.price;
                const adminEarns = calculateCommissionAmount(
                  sellingPrice,
                  product.commission,
                  product.commission_type
                );
                const vendorEarns = calculatePriceAfterCommission(
                  sellingPrice,
                  product.commission,
                  product.commission_type
                );
                const commissionDisplay = product.commission
                  ? `${product.commission}${product.commission_type === 'percentage' ? '%' : currencySymbol}`
                  : '-';

                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                    {showBulkActions && (
                      <td className="p-3 sm:p-4">
                        <button
                          onClick={() => toggleSelectProduct(product.id)}
                          className="text-gray-600 hover:text-gray-800 transition"
                          aria-label={selectedProducts.has(product.id) ? "Deselect product" : "Select product"}
                        >
                          {selectedProducts.has(product.id) ? (
                            <CheckSquare size={18} />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                    )}
                    <td className="p-3 sm:p-4">
                      {image ? (
                        <img
                          src={getImageUrl(image)}
                          className="w-12 h-12 object-cover rounded"
                          alt={product.name}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 font-medium">{product.name}</td>
                    <td className="p-3 sm:p-4">{formatCurrency(sellingPrice)}</td>

                    {showCommissionColumn && (
                      <td className="p-3 sm:p-4">
                        {showCommissionAction ? (
                          <button
                            onClick={() => setCommissionModal({ open: true, product })}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition flex items-center gap-1"
                          >
                            {commissionDisplay}
                            <Pencil size={12} />
                          </button>
                        ) : (
                          <span className="text-sm">{commissionDisplay}</span>
                        )}
                      </td>
                    )}

                    {showAdminEarnsColumn && (
                      <td className="p-3 sm:p-4">
                        <span className="font-medium text-green-600">
                          {formatCurrency(adminEarns)}
                        </span>
                      </td>
                    )}

                    {showVendorEarnsColumn && (
                      <td className="p-3 sm:p-4">
                        <span className="font-medium text-blue-600">
                          {formatCurrency(vendorEarns)}
                        </span>
                      </td>
                    )}

                    {permissions.canViewVendors && (
                      <td className="p-3 sm:p-4">
                        <span className="text-sm font-medium">
                          {getVendorCreatorName(product)}
                        </span>
                      </td>
                    )}
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </td>

                    {showApprovalColumn && (
                      <td className="p-3 sm:p-4">
                        <select
                          value={product.approval_status}
                          onChange={(e) => handleApprovalChange(product.id, e.target.value)}
                          disabled={actionLoading === `approval-${product.id}`}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border focus:ring-2 focus:ring-[#7a1c3d] outline-none transition ${product.approval_status === "approved"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : product.approval_status === "rejected"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : "bg-yellow-100 text-yellow-700 border-yellow-300"
                            } disabled:opacity-50 cursor-pointer`}
                        >
                          <option value="pending" className="bg-white text-yellow-700">
                            ⏳ Pending
                          </option>
                          <option value="approved" className="bg-white text-green-700">
                            ✓ Approved
                          </option>
                          <option value="rejected" className="bg-white text-red-700">
                            ✗ Rejected
                          </option>
                        </select>
                      </td>
                    )}

                    {showStatusColumn && (
                      <td className="p-3 sm:p-4">
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          disabled={actionLoading === `status-${product.id}`}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition ${product.status === 1
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } disabled:opacity-50`}
                        >
                          {actionLoading === `status-${product.id}` ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : product.status === 1 ? (
                            <>
                              <Power size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <PowerOff size={14} />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                    )}

                    <td className="p-3 sm:p-4">
                      <div className="flex justify-center gap-2 flex-wrap">
                        {showEditAction && (
                          <button
                            onClick={() => setEditId(product.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                        )}
                        {showDeleteAction && (
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {approvalModal.open && (
        <ApprovalModal
          product={approvalModal.product}
          action={approvalModal.action}
          onClose={() => setApprovalModal({ open: false, product: null, action: null })}
          onSubmit={handleApprovalSubmit}
        />
      )}

      {bulkModal.open && (
        <BulkApprovalModal
          action={bulkModal.action}
          selectedCount={selectedProducts.size}
          onClose={() => setBulkModal({ open: false, action: null })}
          onSubmit={handleBulkSubmit}
        />
      )}

      {commissionModal.open && (
        <CommissionModal
          product={commissionModal.product}
          onClose={() => setCommissionModal({ open: false, product: null })}
          onSubmit={handleCommissionUpdate}
        />
      )}

      {/* Pagination */}
      {meta?.last_page > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            disabled={meta.current_page === 1}
            onClick={() => handlePageChange(meta.current_page - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Prev
          </button>
          {[...Array(Math.min(meta.last_page, 5))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={i}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 border rounded-lg transition ${meta.current_page === pageNum
                  ? "bg-[#7a1c3d] text-white"
                  : "hover:bg-gray-50"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          {meta.last_page > 5 && <span className="px-2 py-1">...</span>}
          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => handlePageChange(meta.current_page + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Other Modals */}
      {showModal && (
        <ProductForm
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch({ force: true })}
        />
      )}
      {editId && (
        <EditProductModal
          productId={editId}
          onClose={() => setEditId(null)}
          onSuccess={() => refetch({ force: true })}
        />
      )}
      {showAttributeManager && (
        <AttributeManager
          onClose={() => setShowAttributeManager(false)}
          onSuccess={() => refetch({ force: true })}
        />
      )}
    </div>
  );
};

export default Products;