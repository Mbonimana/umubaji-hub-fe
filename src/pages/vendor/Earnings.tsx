import { useEffect, useState } from 'react';
import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import StatsCard from '../../components/vendorDashboard/StatsCard';
import axios from 'axios';
import Notiflix from 'notiflix';
import { getBaseUrl } from '../../config/baseUrl';

// Interfaces matching the Controller Logic
interface PayoutHistory {
  id: number;
  amount: number; // This is the Net amount
  status: string;
  created_at: string;
}

interface PayoutSummary {
  total_earnings: number; // Net Lifetime
  pending_payouts: number; // Net Pending
  month_earnings: number; // Net Monthly
  last_payout_amount: number;
  last_payout_date: string | null;
}

export default function Earnings() {
  const [stats, setStats] = useState<PayoutSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const token = localStorage.getItem("jwtToken");

  const fetchData = async () => {
    if (!token) return;
    try {
      // Endpoint: /api/payouts/vendor/summary
      const res = await axios.get(`${getBaseUrl()}/payouts/vendor/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.summary);
      setPayouts(res.data.history);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Notiflix.Notify.failure("Failed to load earnings data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestPayout = async () => {
    if (!token) {
      Notiflix.Notify.failure("You must be logged in.");
      return;
    }

    if(stats && stats.pending_payouts <= 0) {
        Notiflix.Notify.warning("No available balance to withdraw.");
        return;
    }

    try {
      Notiflix.Loading.standard('Processing Payout...');
      
      // Endpoint: /api/payouts/request
      await axios.post(`${getBaseUrl()}/payouts/request`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      Notiflix.Loading.remove();
      Notiflix.Notify.success("Payout requested successfully!");
      fetchData(); 
    } catch (err: any) {
      Notiflix.Loading.remove();
      const msg = err.response?.data?.error || "Request failed";
      Notiflix.Notify.failure(msg);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'paid') return 'bg-[#E6F7EF] text-[#0F9D58] border-[#BFE9D6]';
    if (s === 'pending') return 'bg-[#FFF8E1] text-[#F57C00] border-[#FFE0B2]';
    if (s === 'rejected') return 'bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#5a4632]">Earnings</h1>
              <p className="text-sm text-gray-500">Overview of your net income (after platform fees)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatsCard
              title="Net Earnings"
              value={stats ? `RF ${stats.total_earnings.toLocaleString()}` : '...'}
              change="Lifetime (Post-Fee)"
              icon="sales"
            />
            <StatsCard
              title="Withdrawable Balance"
              value={stats ? `RF ${stats.pending_payouts.toLocaleString()}` : '...'}
              change="Available Now"
              icon="orders" 
            />
            <StatsCard
              title="This Month"
              value={stats ? `RF ${stats.month_earnings.toLocaleString()}` : '...'}
              change="Net Income"
              icon="sales"
            />
            <StatsCard
              title="Last Payout"
              value={stats ? `RF ${stats.last_payout_amount.toLocaleString()}` : '...'}
              change={formatDate(stats?.last_payout_date || null)}
              icon="views"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-medium text-gray-800">Payout History</h2>
              
              <button
                onClick={requestPayout}
                disabled={loading || !stats || stats.pending_payouts <= 0}
                className={`h-10 px-6 rounded-lg text-sm font-medium transition-colors shadow-sm
                  ${(loading || !stats || stats.pending_payouts <= 0) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#4B341C] text-white hover:bg-[#3a2816]'
                  }`}
              >
                Request Payout
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                 <div className="p-8 text-center text-gray-500">Loading history...</div>
              ) : payouts.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">No payout history found.</div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                      <th className="px-6 py-3">Payout Ref</th>
                      <th className="px-6 py-3">Requested Date</th>
                      <th className="px-6 py-3">Net Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          #{p.id.toString().padStart(6, '0')}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(p.created_at)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          RF {Number(p.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(p.status)}`}>
                            {p.status.toUpperCase()}
                          </span>
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