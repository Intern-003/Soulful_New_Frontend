import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useGet from '../../api/hooks/useGet';
import usePost from '../../api/hooks/usePost';
import usePermissions from '../../api/hooks/usePermissions';
import { Wallet, TrendingUp, Clock, CheckCircle, XCircle, RefreshCw, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorEarningsPage = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ Check permissions
  const canViewWallet = can('wallet', 'view');
  const canWithdraw = can('wallet', 'withdraw');

  // ✅ Redirect if no permission to view wallet
  useEffect(() => {
    if (!canViewWallet) {
      toast.error("You don't have permission to view earnings");
      navigate('/vendor/dashboard');
    }
  }, [canViewWallet, navigate]);

  // ✅ Only fetch data if user has permission
  const { data: walletData, refetch: refetchWallet, loading: walletLoading } = useGet(
    canViewWallet ? '/vendor/wallet' : null
  );
  
  const { data: withdrawalsData, refetch: refetchWithdrawals, loading: withdrawalsLoading } = useGet(
    canViewWallet ? '/vendor/withdrawals' : null
  );
  
  const { data: settlementsData, refetch: refetchSettlements } = useGet(
    canViewWallet ? '/vendor/wallet/settlements' : null
  );
  
  const { postData } = usePost();

  // ✅ Extract data with proper fallbacks
  const wallet = walletData?.data || walletData || {};
  
  let withdrawals = [];
  if (withdrawalsData) {
    if (withdrawalsData.data && Array.isArray(withdrawalsData.data)) {
      withdrawals = withdrawalsData.data;
    } else if (Array.isArray(withdrawalsData)) {
      withdrawals = withdrawalsData;
    } else if (withdrawalsData.data && withdrawalsData.data.data && Array.isArray(withdrawalsData.data.data)) {
      withdrawals = withdrawalsData.data.data;
    }
  }
  
  const settlements = settlementsData?.data || settlementsData || {};

  // ✅ Check permission before withdrawal
  const handleWithdraw = async () => {
    // ✅ Permission check
    if (!canWithdraw) {
      toast.error("You don't have permission to withdraw funds");
      return;
    }

    const minAmount = 100;
    const maxAmount = wallet?.available_balance || 0;

    if (!amount || Number(amount) < minAmount) {
      toast.error(`Minimum withdrawal amount is ₹${minAmount}`);
      return;
    }

    if (Number(amount) > maxAmount) {
      toast.error(`Insufficient balance. Available: ₹${maxAmount.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await postData({ 
        url: '/vendor/wallet/withdraw', 
        data: { amount: Number(amount) } 
      });
      toast.success('Withdrawal request submitted successfully');
      setAmount('');
      refetchWallet();
      refetchWithdrawals();
      refetchSettlements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Loading state with permission check
  if (!canViewWallet) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view earnings</p>
          <button 
            onClick={() => navigate('/vendor/dashboard')}
            className="mt-4 px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e1530]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (walletLoading || withdrawalsLoading) {
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
          <h1 className="text-2xl font-bold text-[#7a1c3d]">My Earnings</h1>
          <p className="text-sm text-gray-500">Track your earnings and manage withdrawals</p>
        </div>
        <button 
          onClick={() => {
            refetchWallet();
            refetchWithdrawals();
            refetchSettlements();
          }} 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Balance Cards - Show even if can't withdraw */}
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
            <p className="text-sm text-blue-700">Pending Settlement</p>
          </div>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            ₹{Number(wallet?.pending_balance || 0).toLocaleString()}
          </p>
          <p className="text-xs text-blue-600 mt-1">{settlements?.pending_settlement?.items_count || 0} items pending</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" />
            <p className="text-sm text-green-700">Total Earned</p>
          </div>
          <p className="text-2xl font-bold text-green-800 mt-2">
            ₹{Number(wallet?.total_earned || 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1">Lifetime earnings</p>
        </div>
      </div>

      {/* ✅ Withdrawal Request Form - Conditional Rendering */}
      {canWithdraw ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold mb-4 text-gray-800">Request Withdrawal</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none transition"
                min="100"
                step="1"
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={isSubmitting || !amount || Number(amount) < 100 || Number(amount) > (wallet?.available_balance || 0)}
              className="bg-[#7a1c3d] text-white px-8 py-3 rounded-lg hover:bg-[#5e1530] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium"
            >
              {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <span>💰 Minimum: ₹100</span>
            <span>💳 Available: ₹{Number(wallet?.available_balance || 0).toLocaleString()}</span>
            <span>⏱️ Processing: 2-3 business days</span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Withdrawal Not Available</p>
              <p className="text-xs text-gray-500">You don't have permission to withdraw funds</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Settlements */}
      {settlements?.pending_settlement?.items_count > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <h2 className="font-semibold p-5 border-b text-gray-800 flex justify-between items-center">
            <span>Pending Settlements</span>
            <span className="text-sm font-normal text-gray-500">
              {settlements.pending_settlement.items_count} items • ₹{Number(settlements.pending_settlement.total_amount || 0).toLocaleString()}
            </span>
          </h2>
          <div className="p-5">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Pending Settlement Amount</p>
                  <p className="text-xl font-bold text-yellow-800">
                    ₹{Number(settlements.pending_settlement.total_amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {settlements.pending_settlement.orders_count} orders pending settlement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal History - Conditional based on view permission */}
      {canViewWallet && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <h2 className="font-semibold p-5 border-b text-gray-800">Withdrawal History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requested Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(withdrawals) || withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Clock size={32} className="text-gray-300" />
                        <p>No withdrawal requests found</p>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorEarningsPage;