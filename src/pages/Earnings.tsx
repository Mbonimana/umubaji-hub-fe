import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import StatsCard from '../components/vendorDashboard/StatsCard';

export default function Earnings() {
  const stats = [
    { title: 'Total Earnings', value: '₦3,245,800', change: '+6.4%', icon: 'sales' as const },
    { title: 'Pending Payouts', value: '₦245,300', change: 'Awaiting clearance', icon: 'orders' as const },
    { title: 'This Month', value: '₦812,400', change: '+2.1%', icon: 'sales' as const },
    { title: 'Last Payout', value: '₦520,000', change: 'Oct 15, 2025', icon: 'views' as const },
  ];

  const payouts = [
    { id: 'P-20251015', date: '2025-10-15', amount: 520000, status: 'Completed' },
    { id: 'P-20250915', date: '2025-09-15', amount: 480000, status: 'Completed' },
    { id: 'P-20250815', date: '2025-08-15', amount: 450000, status: 'Completed' },
  ];

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Earnings</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {stats.map((s) => (
              <StatsCard key={s.title} title={s.title} value={s.value} change={s.change} icon={s.icon} />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Payout History</h2>
              <button className="h-9 px-4 rounded-md bg-[#4B341C] text-white hover:opacity-90">Request Payout</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f9fafb] text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Payout ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p, idx) => (
                    <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.id}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-800">₦{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F7EF] text-[#0F9D58] border border-[#BFE9D6]">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
