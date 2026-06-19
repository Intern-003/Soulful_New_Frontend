// pages/dashboard/VendorWithdrawalsPage.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useGet from '../../api/hooks/useGet';
import usePermissions from '../../api/hooks/usePermissions';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Shield,
  Wallet,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorWithdrawalsPage = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  // ✅ Vendor-specific permissions
  const canViewWallet = can('wallet', 'view');
  const canWithdraw = can('wallet', 'withdraw');

  // ✅ Redirect if no permission
  useEffect(() => {
    if (!canViewWallet) {
      toast.error("You don't have permission to view your withdrawals");
      navigate('/dashboard');
    }
  }, [canViewWallet, navigate]);

  // ✅ Vendor API call - gets ONLY own withdrawals
  const { data, refetch, loading } = useGet(
    canViewWallet 
      ? `/vendor/withdrawals?page=${currentPage}${statusFilter ? `&status=${statusFilter}` : ''}` 
      : null
  );
  
  // ✅ Vendor Wallet API for balance
  const { data: walletData, refetch: refetchWallet } = useGet(
    canViewWallet ? '/vendor/wallet' : null
  );

  // ✅ Extract withdrawal data
  let withdrawals = [];
  let pagination = { current_page: 1, last_page: 1, total: 0, per_page: 20 };
  
  if (data) {
    if (data.data && Array.isArray(data.data)) {
      withdrawals = data.data;
      pagination = data.meta || data.pagination || pagination;
    } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
      withdrawals = data.data.data;
      pagination = data.data;
    } else if (Array.isArray(data)) {
      withdrawals = data;
    }
  }

  // ✅ Wallet data
  const wallet = walletData?.data || walletData || {};

  // ✅ Vendor-specific stats - only own withdrawals
  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter(w => w.status === 'pending').length,
    approved: withdrawals.filter(w => w.status === 'approved').length,
    rejected: withdrawals.filter(w => w.status === 'rejected').length,
    totalAmount: withdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0)
  };

  // ✅ Access Denied UI
  if (!canViewWallet) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view withdrawals</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e1530]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
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
          <h1 className="text-2xl font-bold text-[#7a1c3d]">💰 My Withdrawals</h1>
          <p className="text-sm text-gray-500">Track your withdrawal requests</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
          >
            <option value="">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
          </select>
          <button 
            onClick={() => {
              refetch({ force: true });
              refetchWallet();
            }} 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Vendor Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-[#7a1c3d] to-[#9e2a4f] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="opacity-80" />
            <p className="text-sm opacity-90">Available Balance</p>
          </div>
          <p className="text-3xl font-bold mt-2">₹{Number(wallet?.available_balance || 0).toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">Ready for withdrawal</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            <p className="text-sm text-blue-700">Pending Withdrawals</p>
          </div>
          <p className="text-2xl font-bold text-blue-800 mt-2">{stats.pending}</p>
          <p className="text-xs text-blue-600 mt-1">₹{withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + Number(w.amount || 0), 0).toLocaleString()} pending</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm text-green-700">Total Withdrawn</p>
          </div>
          <p className="text-2xl font-bold text-green-800 mt-2">₹{stats.totalAmount.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">{stats.approved} approved withdrawals</p>
        </div>
      </div>

      {/* Table - Shows ONLY vendor's own withdrawals */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requested Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(withdrawals) || withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} className="text-gray-300" />
                      <p>No withdrawal requests found</p>
                      {canWithdraw && (
                        <button 
                          onClick={() => navigate('/dashboard/earnings')}
                          className="mt-2 px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e1530] text-sm"
                        >
                          Request Withdrawal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold text-gray-900">₹{Number(w.amount).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                        w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        w.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {w.status === 'approved' && <CheckCircle size={12} />}
                        {w.status === 'rejected' && <XCircle size={12} />}
                        {w.status === 'pending' && <Clock size={12} />}
                        {w.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {new Date(w.requested_at || w.created_at).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(w.requested_at || w.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      #{w.id}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {w.notes || '-'}
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

export default VendorWithdrawalsPage;