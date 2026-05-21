import React from 'react';
import toast from 'react-hot-toast';
import useGet from '../../api/hooks/useGet';
import usePut from '../../api/hooks/usePut';
import usePermissions from '../../api/hooks/usePermissions';

const AdminWithdrawalsPage = () => {
  const { can } = usePermissions();
  const { data, refetch, loading } = useGet('/admin/withdraw-requests');
  const { putData, loading: updating } = usePut();
  
  const handleApprove = async (id) => {
    try {
      await putData({ url: `/admin/withdraw-requests/${id}/approve` });
      toast.success('Withdrawal approved successfully');
      refetch({ force: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve withdrawal');
    }
  };
  
  const handleReject = async (id) => {
    try {
      await putData({ url: `/admin/withdraw-requests/${id}/reject` });
      toast.success('Withdrawal rejected');
      refetch({ force: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject withdrawal');
    }
  };
  
  // ✅ Fix: Extract the array from paginated response
  const withdrawals = data?.data?.data || data?.data || [];
  
  // Pagination info
  const pagination = data?.data || { current_page: 1, last_page: 1, total: 0 };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading withdrawal requests...</div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#7a1c3d]">Withdrawal Requests</h1>
        <button 
          onClick={() => refetch({ force: true })} 
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Refresh
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Seller</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Requested Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">
                      {w.seller_name || w.vendor?.store_name || w.user?.name || `Vendor #${w.vendor_id || w.user_id}`}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        w.seller_type === 'vendor' ? 'bg-purple-100 text-purple-700' :
                        w.seller_type === 'individual' ? 'bg-blue-100 text-blue-700' :
                        w.vendor_id ? 'bg-purple-100 text-purple-700' :
                        w.user_id ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {w.seller_type === 'vendor' ? 'Vendor Store' : 
                         w.seller_type === 'individual' ? 'Individual Seller' :
                         w.vendor_id ? 'Vendor Store' :
                         w.user_id ? 'Individual Seller' : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold">₹{Number(w.amount).toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(w.requested_at).toLocaleDateString()}
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
                          <button
                            onClick={() => handleApprove(w.id)}
                            disabled={updating}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(w.id)}
                            disabled={updating}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination (if needed) */}
      {pagination.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
          <span className="px-3 py-1">Page {pagination.current_page} of {pagination.last_page}</span>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawalsPage;