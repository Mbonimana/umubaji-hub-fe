import { useEffect, useState } from 'react';
import Sidebar from '../../components/adminDashboard/Sidebar'; 
import Navbar from '../../components/adminDashboard/Navbar'; 
import axios from 'axios';
import Notiflix from 'notiflix';
import { getBaseUrl } from '../../config/baseUrl';

// Interface matching the SQL result from getAllPayoutRequests
interface PayoutRequest {
  id: number;
  vendor_id: number;
  vendor_name: string; 
  total_amount: number; 
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminPayouts() {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const token = localStorage.getItem("jwtToken"); // Admin Token

  // --- Logic Functions (UNCHANGED) ---
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/payouts/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Notiflix.Notify.failure("Failed to load payout requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (payoutId: number, amount: number, vendorName: string) => {
    Notiflix.Confirm.show(
      'Confirm Payout',
      `Are you sure you want to approve the payout of RF ${amount.toLocaleString()} to ${vendorName}?`,
      'Yes, Approve',
      'Cancel',
      async () => {
        await executeApproval(payoutId);
      },
      () => {},
      {
        width: '320px',
        borderRadius: '8px',
        titleColor: '#5a4632',
        okButtonBackground: '#4B341C',
        cssAnimationStyle: 'zoom',
      }
    );
  };

  const executeApproval = async (payoutId: number) => {
    setProcessingId(payoutId); 
    try {
      await axios.patch(
        `${getBaseUrl()}/payouts/approve/${payoutId}`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Notiflix.Notify.success("Payout Approved Successfully!");
      setRequests((prev) =>
        prev.map((req) =>
          req.id === payoutId ? { ...req, status: 'approved' } : req
        )
      );
    } catch (err: any) {
      const msg = err.response?.data?.error || "Approval failed";
      Notiflix.Notify.failure(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // --- UI Helpers (UNCHANGED) ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">PAID</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">PENDING</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  // --------------------------------------------------------
  //  RENDER SECTION - FIXED ALIGNMENT
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar - FIXED (w-64) */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      {/* Main Content Wrapper - Starts after Sidebar width (ml-64) */}
      <div className="flex-1 ml-18 flex flex-col">
        
        {/* Navbar - FIXED (h-16) */}
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200 h-16">
          <Navbar />
        </div>

        {/*  Main Content Area - Use pt-16 to push content exactly below the h-16 Navbar */}
        <main className="flex-1 **pt-16** p-8 overflow-y-auto">
          
          {/* Dashboard Header/Title Section - ALIGNED AND STYLED */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            
            {/* Title and Subtitle - Left Aligned */}
            <div>
              <h1 className="text-3xl font-bold text-[#5a4632]">Vendor Payouts</h1>
              <p className="text-gray-500 mt-1">Manage and approve withdrawal requests</p>
            </div>
            
            {/* Summary Stats/Action - Right Aligned */}
            <div className="flex items-center">
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm mr-4">
                <span className="text-sm text-gray-500">Pending Requests: </span>
                <span className="text-lg font-bold text-orange-600">
                  {requests.filter(r => r.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-10 text-center text-gray-500">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="p-10 text-center text-gray-500">No payout requests found.</div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f0f0f0] border-b border-gray-200 text-gray-700 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-4">Request Date</th>
                      <th className="px-6 py-4">Vendor Name</th>
                      <th className="px-6 py-4">Amount (Net)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Data rows */}
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {formatDate(req.created_at)}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {req.vendor_name || `Vendor #${req.vendor_id}`}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#5a4632]">
                          RF {Number(req.total_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(req.status)}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 text-right">
                          {req.status === 'pending' ? (
                            <button
                              onClick={() => handleApprove(req.id, req.total_amount, req.vendor_name)}
                              disabled={processingId === req.id}
                              className={`
                                inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all
                                ${processingId === req.id 
                                  ? 'bg-gray-200 text-gray-400 cursor-wait' 
                                  : 'bg-[#4B341C] text-white hover:bg-[#3a2816] shadow-sm hover:shadow'
                                }
                              `}
                            >
                              {processingId === req.id ? 'Processing...' : 'Approve'}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Completed</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}