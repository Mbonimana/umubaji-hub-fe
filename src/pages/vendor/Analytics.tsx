import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import StatsCard from '../../components/vendorDashboard/StatsCard';
import BarChart from '../../components/vendorDashboard/BarChart';
import LineChart from '../../components/vendorDashboard/LineChart';

export default function Analytics() {
  const stats = [
    { title: 'Total Views', value: '124,500', change: '+8.2%', icon: 'views' as const },
    { title: 'Total Sales', value: '₦2,345,000', change: '+5.9%', icon: 'sales' as const },
    { title: 'Total Orders', value: 842, change: '+3.4%', icon: 'orders' as const },
    { title: 'Avg Rating', value: 4.6, change: 'Last 30 days', icon: 'rating' as const },
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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Analytics</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {stats.map((s) => (
              <StatsCard key={s.title} title={s.title} value={s.value} change={s.change} icon={s.icon} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart />
            <LineChart />
          </div>
        </main>
      </div>
    </div>
  );
}
