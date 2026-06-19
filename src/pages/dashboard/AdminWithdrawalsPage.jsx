// pages/dashboard/AdminWithdrawalsPage.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import useGet from '../../api/hooks/useGet';
import usePut from '../../api/hooks/usePut';
import usePermissions from '../../api/hooks/usePermissions';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Shield,
  Filter,
  Search,
  Users,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminWithdrawalsPage = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  
  // ✅ State
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  
  // ✅ Cache for search results
  const searchCache = useRef(new Map());
  
  // ✅ Debounce timer ref
  const debounceTimerRef = useRef(null);
  const isFirstRender = useRef(true);

  // ✅ Admin-specific permissions
  const canViewWithdrawals = can('withdrawal', 'view');
  const canApproveWithdrawals = can('withdrawal', 'approve');

  // ✅ Redirect if no permission
  useEffect(() => {
    if (!canViewWithdrawals) {
      toast.error("You don't have permission to view withdrawals");
      navigate('/admin/dashboard');
    }
  }, [canViewWithdrawals, navigate]);

  // ✅ Build cache key from all filters
  const buildCacheKey = useCallback(() => {
    return JSON.stringify({
      page: currentPage,
      status: statusFilter,
      search: debouncedSearchTerm,
      dateRange,
      minAmount,
      maxAmount
    });
  }, [currentPage, statusFilter, debouncedSearchTerm, dateRange, minAmount, maxAmount]);

  // ✅ Check cache before making API call
  const getCachedData = useCallback((cacheKey) => {
    return searchCache.current.get(cacheKey);
  }, []);

  // ✅ Store data in cache
  const setCachedData = useCallback((cacheKey, data) => {
    if (searchCache.current.size > 50) {
      const firstKey = searchCache.current.keys().next().value;
      searchCache.current.delete(firstKey);
    }
    searchCache.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // ✅ Clear cache when data changes
  const clearCache = useCallback(() => {
    searchCache.current.clear();
  }, []);

  // ✅ Debounce search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchTerm) {
      setDebouncedSearchTerm('');
      setCurrentPage(1);
      setIsSearching(false);
      return;
    }

    if (searchTerm.length < 2 && searchTerm.length > 0) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delay = searchTerm.length < 3 ? 300 : 500;
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      setIsSearching(false);
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // ✅ Build API URL
  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage);
    
    if (statusFilter) params.append('status', statusFilter);
    if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
    if (dateRange.start) params.append('date_from', dateRange.start);
    if (dateRange.end) params.append('date_to', dateRange.end);
    if (minAmount) params.append('min_amount', minAmount);
    if (maxAmount) params.append('max_amount', maxAmount);
    
    return `/admin/withdraw-requests?${params.toString()}`;
  }, [currentPage, statusFilter, debouncedSearchTerm, dateRange, minAmount, maxAmount]);

  // ✅ API call with cache
  const apiUrl = canViewWithdrawals ? buildApiUrl() : null;
  const cacheKey = buildCacheKey();
  const cachedData = getCachedData(cacheKey);
  const shouldUseCache = cachedData && (Date.now() - cachedData.timestamp < 300000);

  const { data, refetch, loading } = useGet(
    canViewWithdrawals && !shouldUseCache ? apiUrl : null
  );

  useEffect(() => {
    if (data && apiUrl) {
      setCachedData(cacheKey, data);
    }
  }, [data, apiUrl, cacheKey, setCachedData]);

  const effectiveData = shouldUseCache ? cachedData.data : data;
  
  const { putData, loading: updating } = usePut();

  // ✅ Extract data
  let withdrawals = [];
  let pagination = { current_page: 1, last_page: 1, total: 0, per_page: 20 };
  
  if (effectiveData) {
    if (effectiveData.data && Array.isArray(effectiveData.data)) {
      withdrawals = effectiveData.data;
      pagination = effectiveData.meta || effectiveData.pagination || pagination;
    } else if (effectiveData.data && effectiveData.data.data && Array.isArray(effectiveData.data.data)) {
      withdrawals = effectiveData.data.data;
      pagination = effectiveData.data;
    } else if (Array.isArray(effectiveData)) {
      withdrawals = effectiveData;
    }
  }

  // ✅ Stats
  const stats = useMemo(() => {
    return {
      total: withdrawals.length,
      pending: withdrawals.filter(w => w.status === 'pending').length,
      approved: withdrawals.filter(w => w.status === 'approved').length,
      rejected: withdrawals.filter(w => w.status === 'rejected').length,
      totalAmount: withdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0),
      uniqueVendors: new Set(withdrawals.map(w => w.vendor_id)).size
    };
  }, [withdrawals]);

  // ✅ Handlers
  const handleApprove = async (id) => {
    if (!canApproveWithdrawals) {
      toast.error("You don't have permission to approve withdrawals");
      return;
    }
    
    if (!window.confirm('Are you sure you want to approve this withdrawal request?')) return;
    
    try {
      await putData({ url: `/admin/withdraw-requests/${id}/approve` });
      toast.success('Withdrawal approved successfully');
      clearCache();
      refetch({ force: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve withdrawal');
    }
  };

  const handleReject = async (id) => {
    if (!canApproveWithdrawals) {
      toast.error("You don't have permission to reject withdrawals");
      return;
    }
    
    if (!window.confirm('Are you sure you want to reject this withdrawal request?')) return;
    
    try {
      await putData({ url: `/admin/withdraw-requests/${id}/reject` });
      toast.success('Withdrawal rejected');
      clearCache();
      refetch({ force: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject withdrawal');
    }
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setStatusFilter('');
    setDateRange({ start: '', end: '' });
    setMinAmount('');
    setMaxAmount('');
    setCurrentPage(1);
  };

  // ✅ Quick filter buttons
  const quickFilters = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  // ✅ Access Denied UI
  if (!canViewWithdrawals) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view withdrawal requests</p>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e1530]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !effectiveData && withdrawals.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7a1c3d]">💰 Withdrawal Requests</h1>
          <p className="text-sm text-gray-500">Manage all vendor and seller withdrawal requests</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => {
              clearCache();
              refetch({ force: true });
            }} 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border rounded-lg hover:bg-gray-50 transition bg-white"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ✅ SEARCH BAR - ALWAYS VISIBLE */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input - Always visible */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vendor name, email, or ID..."
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7a1c3d]"></div>
              </div>
            )}
          </div>

          {/* Quick Status Filters */}
          <div className="flex gap-1 bg-gray-50 rounded-lg p-1 flex-shrink-0">
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleStatusChange({ target: { value: filter.value } })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-[#7a1c3d] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition flex-shrink-0 ${
              showAdvancedFilters ? 'bg-[#7a1c3d] text-white border-[#7a1c3d]' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="text-sm hidden sm:inline">
              {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
            </span>
          </button>
        </div>

        {/* ✅ Advanced Filters Panel - Collapsible */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Date Range */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-[#7a1c3d]"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-[#7a1c3d]"
                  placeholder="To"
                />
              </div>

              {/* Amount Range */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Min Amount"
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-[#7a1c3d]"
                />
                <input
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Max Amount"
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-[#7a1c3d]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                  }}
                  className="flex-1 bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e1530] transition text-sm"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(dateRange.start || dateRange.end || minAmount || maxAmount) && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500">Active filters:</span>
                {dateRange.start && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                    From: {dateRange.start}
                  </span>
                )}
                {dateRange.end && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                    To: {dateRange.end}
                  </span>
                )}
                {minAmount && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                    Min: ₹{minAmount}
                  </span>
                )}
                {maxAmount && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                    Max: ₹{maxAmount}
                  </span>
                )}
                <button
                  onClick={() => {
                    setDateRange({ start: '', end: '' });
                    setMinAmount('');
                    setMaxAmount('');
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* ✅ Search Results Info */}
        {(debouncedSearchTerm || statusFilter) && (
          <div className="mt-3 text-sm text-gray-600">
            {withdrawals.length > 0 ? (
              <span>
                Found <strong>{withdrawals.length}</strong> result{withdrawals.length !== 1 ? 's' : ''}
                {debouncedSearchTerm && <span> for "<strong>{debouncedSearchTerm}</strong>"</span>}
                {statusFilter && <span> • Status: <span className="capitalize">{statusFilter}</span></span>}
              </span>
            ) : (
              <span className="text-amber-600">
                No results found matching your criteria
                {debouncedSearchTerm && <span> for "<strong>{debouncedSearchTerm}</strong>"</span>}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-400">₹{stats.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-600" />
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm text-green-700">Approved</p>
          </div>
          <p className="text-2xl font-bold text-green-800">{stats.approved}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-200">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-purple-600" />
            <p className="text-sm text-purple-700">Unique Vendors</p>
          </div>
          <p className="text-2xl font-bold text-purple-800">{stats.uniqueVendors}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requested</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && isSearching ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7a1c3d]"></div>
                      <span className="text-sm text-gray-500">Searching...</span>
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(withdrawals) || withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} className="text-gray-300" />
                      <p>
                        {debouncedSearchTerm || statusFilter
                          ? 'No results found matching your filters'
                          : 'No withdrawal requests found'}
                      </p>
                      {(debouncedSearchTerm || statusFilter) && (
                        <button
                          onClick={clearAllFilters}
                          className="text-[#7a1c3d] hover:underline text-sm"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">
                        {w.seller_name || w.vendor?.store_name || w.user?.name || `ID: ${w.vendor_id || w.user_id}`}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        w.seller_type === 'vendor' || w.vendor_id ? 'bg-purple-100 text-purple-700' :
                        w.seller_type === 'individual' || w.user_id ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {w.vendor_id ? 'Vendor' : 'Seller'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-gray-900">₹{Number(w.amount).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      ₹{Number(w.current_balance || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {new Date(w.requested_at || w.created_at).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(w.requested_at || w.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                        w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {w.status === 'pending' && (
                        <div className="flex gap-2">
                          {canApproveWithdrawals ? (
                            <>
                              <button
                                onClick={() => handleApprove(w.id)}
                                disabled={updating}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                              >
                                <CheckCircle size={12} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(w.id)}
                                disabled={updating}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                              >
                                <XCircle size={12} />
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">
                              🔒 No permission
                            </span>
                          )}
                        </div>
                      )}
                      {w.status !== 'pending' && (
                        <span className="text-xs text-gray-400">
                          {w.status === 'approved' ? `✅ ${new Date(w.approved_at).toLocaleDateString()}` : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex flex-wrap justify-between items-center px-5 py-3 border-t">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {pagination.current_page || currentPage} of {pagination.last_page || 1}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.last_page || 1, currentPage + 1))}
                disabled={currentPage === (pagination.last_page || 1)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawalsPage;