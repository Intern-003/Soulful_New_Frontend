// src/pages/dashboard/Products.jsx
import React, { useState, useEffect, useRef } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";
import { getImageUrl } from "../../utils/getImageUrl";
import ProductForm from "../../components/dashboard/products/ProductForm";
import EditProductModal from "../../components/dashboard/products/EditProductModal";
import AttributeManager from "../../components/dashboard/products/AttributeManager";
import { Settings, CheckCircle, XCircle, Power, PowerOff, RefreshCw, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";

const Products = () => {
  const { data, loading, error, refetch } = useGet("/admin/products");
  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAttributeManager, setShowAttributeManager] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);

  // Bulk selection states
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Use ref to track initial load
  const isInitialLoad = useRef(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  const products = data?.data || [];
  const meta = data;

  // Update local products only when products reference changes
  useEffect(() => {
    if (isInitialLoad.current) {
      setLocalProducts(products);
      isInitialLoad.current = false;
    } else if (JSON.stringify(localProducts) !== JSON.stringify(products)) {
      setLocalProducts(products);
    }
  }, [products]);

  // Filter logic (using localProducts for instant updates)
  const filteredProducts = localProducts.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStock =
      stockFilter === "in" ? p.stock > 0 : stockFilter === "out" ? p.stock === 0 : true;
    const matchesApproval =
      approvalFilter === "approved"
        ? p.approval_status === "approved"
        : approvalFilter === "pending"
          ? p.approval_status === "pending"
          : approvalFilter === "rejected"
            ? p.approval_status === "rejected"
            : true;
    const matchesStatus =
      statusFilter === "active" ? p.status === 1 : statusFilter === "inactive" ? p.status === 0 : true;
    return matchesSearch && matchesStock && matchesApproval && matchesStatus;
  });

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const toggleSelectProduct = (id) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const [approvalModal, setApprovalModal] = useState({
    open: false,
    product: null,
    action: null, // 'approve' | 'reject'
  });

  // Bulk Approve/Reject handler
  const handleBulkAction = async (action) => {
    if (selectedProducts.size === 0) {
      toast.error("Please select products to " + action);
      return;
    }

    if (!window.confirm(`Are you sure you want to ${action} ${selectedProducts.size} product(s)?`)) return;

    setBulkActionLoading(true);

    // Optimistic update - Update all selected products in UI
    const isApprove = action === 'approve';
    setLocalProducts(prev => prev.map(p =>
      selectedProducts.has(p.id)
        ? {
          ...p,
          approval_status: isApprove ? "approved" : "rejected",
          status: isApprove ? 1 : 0
        }
        : p
    ));

    try {
      await postData({
        url: `/admin/products/bulk-toggle-approval`,
        data: {
          ids: Array.from(selectedProducts),
          action: action
        }
      });

      toast.success(`${selectedProducts.size} product(s) ${action}d successfully`);
      setSelectedProducts(new Set());
      await refetch({ force: true });
    } catch (err) {
      // Revert on error
      await refetch({ force: true });
      toast.error(err?.response?.data?.message || `Failed to ${action} products`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Handle dropdown approval change
  const handleApprovalChange = async (productId, newStatus) => {
    // Don't do anything if status is the same
    const product = localProducts.find(p => p.id === productId);
    if (product.approval_status === newStatus) return;

    // Open modal for approve/reject actions
    if (newStatus === 'approved') {
      setApprovalModal({
        open: true,
        product: product,
        action: 'approve'
      });
    } else if (newStatus === 'rejected') {
      setApprovalModal({
        open: true,
        product: product,
        action: 'reject'
      });
    }
  };

  const ApprovalModal = ({ product, action, onClose, onSubmit }) => {
    const [commission, setCommission] = useState("");
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
      if (action === "approve" && !commission) {
        toast.error("Please enter commission percentage");
        return;
      }
      if (action === "reject" && !reason) {
        toast.error("Please enter rejection reason");
        return;
      }

      onSubmit({
        product,
        action,
        commission,
        rejection_reason: reason,
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-[400px] max-w-[90%]">
          <h2 className="text-lg font-bold mb-4">
            {action === "approve" ? "Approve" : "Reject"}: {product.name}
          </h2>

          {action === "approve" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Commission %</label>
              <input
                type="number"
                placeholder="Enter commission percentage"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-[#7a1c3d] outline-none"
              />
            </div>
          )}

          {action === "reject" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Rejection Reason</label>
              <textarea
                placeholder="Enter rejection reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-[#7a1c3d] outline-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLocalProducts(prev => prev.filter(p => p.id !== id));

    try {
      await deleteData({ url: `/vendor/products/${id}` });
      toast.success("Product deleted successfully");
      // Remove from selected set if present
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      await refetch({ force: true });
      toast.error("Failed to delete product");
    }
  };

  const handleApprovalSubmit = async ({ product, action, commission, rejection_reason }) => {
    setActionLoading(`approval-${product.id}`);

    try {
      await postData({
        url: `/admin/products/${product.id}/toggle-approval`,
        data: {
          action,
          commission,
          rejection_reason,
        },
      });

      // Update UI AFTER success
      setLocalProducts(prev =>
        prev.map(p =>
          p.id === product.id
            ? {
              ...p,
              approval_status: action === "approve" ? "approved" : "rejected",
              status: action === "approve" ? 1 : 0,
            }
            : p
        )
      );

      toast.success(`Product ${action}d successfully`);
    } catch (err) {
      await refetch({ force: true });
      toast.error(err?.response?.data?.message || "Failed to update approval status");
    } finally {
      setApprovalModal({ open: false, product: null, action: null });
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setLocalProducts(prev => prev.map(p =>
      p.id === id ? { ...p, status: currentStatus === 1 ? 0 : 1 } : p
    ));

    setActionLoading(`status-${id}`);
    try {
      await putData({ url: `/admin/products/${id}/toggle-status` });
      toast.success(currentStatus === 1 ? "Product deactivated" : "Product activated");
    } catch (err) {
      await refetch({ force: true });
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedProducts(new Set()); // Clear selections on page change
    refetch({ url: `/admin/products?page=${newPage}`, force: true });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d]"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500">Error loading products: {error}</div>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-[#7a1c3d]">Products</h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAttributeManager(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm sm:text-base"
          >
            <Settings size={18} />
            Manage Attributes
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition text-sm sm:text-base"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.size > 0 && (
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
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full sm:w-64 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        />
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        >
          <option value="">All Approval</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 sm:p-4 w-10">
                <button
                  onClick={toggleSelectAll}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </th>
              <th className="p-3 sm:p-4">Image</th>
              <th className="p-3 sm:p-4">Name</th>
              <th className="p-3 sm:p-4">Price</th>
              <th className="p-3 sm:p-4">Stock</th>
              <th className="p-3 sm:p-4">Approval</th>
              <th className="p-3 sm:p-4">Status</th>
              <th className="p-3 sm:p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-400">
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
                    <td className="p-3 sm:p-4">
                      <button
                        onClick={() => toggleSelectProduct(product.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {selectedProducts.has(product.id) ? (
                          <CheckSquare size={18} />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
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
                    <td className="p-3 sm:p-4">₹{product.discount_price || product.price}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </td>

                    {/* Approval Status Dropdown */}
                    <td className="p-3 sm:p-4">
                      <select
                        value={product.approval_status}
                        onChange={(e) => handleApprovalChange(product.id, e.target.value)}
                        disabled={actionLoading === `approval-${product.id}`}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border focus:ring-2 focus:ring-[#7a1c3d] outline-none transition ${
                          product.approval_status === "approved"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : product.approval_status === "rejected"
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-yellow-100 text-yellow-700 border-yellow-300"
                        } disabled:opacity-50`}
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

                    {/* Status Toggle */}
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

                    <td className="p-3 sm:p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setEditId(product.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
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

      {/* Approval Modal */}
      {approvalModal.open && (
        <ApprovalModal
          product={approvalModal.product}
          action={approvalModal.action}
          onClose={() => setApprovalModal({ open: false, product: null, action: null })}
          onSubmit={handleApprovalSubmit}
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

      {/* Modals */}
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