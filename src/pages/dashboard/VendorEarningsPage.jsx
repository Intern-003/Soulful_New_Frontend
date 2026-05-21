import React, { useState } from 'react';
import toast from 'react-hot-toast';
import useGet from '../../api/hooks/useGet';
import usePost from '../../api/hooks/usePost';
import usePermissions from '../../api/hooks/usePermissions';

const VendorEarningsPage = () => {
  const { can } = usePermissions();
  const { data: wallet, refetch: refetchWallet } = useGet('/vendor/wallet');
  const { data: withdrawalsData, refetch: refetchWithdrawals } = useGet('/vendor/withdrawals');
  const { postData, loading } = usePost();
  const [amount, setAmount] = useState('');
  
  const withdrawals = withdrawalsData?.data || withdrawalsData || [];
  
  const handleWithdraw = async () => {
    if (amount < 100) {
      toast.error('Minimum withdrawal amount is ₹100');
      return;
    }
    
    if (amount > (wallet?.data?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    
    try {
      await postData({ 
        url: '/vendor/wallet/withdraw', 
        data: { 
          amount: amount 
        } 
      });
      toast.success('Withdrawal request submitted successfully');
      setAmount('');
      refetchWallet();
      refetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit withdrawal request');
    }
  };
  
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#7a1c3d]">My Earnings</h1>
      
      <div className="bg-gradient-to-r from-[#7a1c3d] to-[#9e2a4f] rounded-xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-90">Available Balance</p>
        <p className="text-3xl font-bold mt-2">₹{Number(wallet?.data?.balance || 0).toLocaleString()}</p>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h2 className="font-semibold mb-4 text-gray-800">Request Withdrawal</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border rounded-lg px-4 py-2 flex-1 focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
            min="100"
          />
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="bg-[#7a1c3d] text-white px-6 py-2 rounded-lg hover:bg-[#5e1530] transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: ₹100</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <h2 className="font-semibold p-5 border-b text-gray-800">Withdrawal History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Requested Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-5 py-8 text-center text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3">₹{Number(w.amount).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                        w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(w.requested_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorEarningsPage;