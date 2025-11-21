
import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import StatsCard from '../components/vendorDashboard/StatsCard';
import BarChart from '../components/vendorDashboard/BarChart';
import LineChart from '../components/vendorDashboard/LineChart';
import RecentOrders from '../components/vendorDashboard/RecentOrders';
import TopProducts from '../components/vendorDashboard/TopProducts';

export default function VendorDashboard() {
  

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
        
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 mt-4">
            <StatsCard title="Total Views" value="12,458" change="+12% this month" icon="views" />
            <StatsCard title="Total Sales" value="RF561K" change="+8% this month" icon="sales" />
            <StatsCard title="Total Orders" value="117" change="+15% this month" icon="orders" />
            <StatsCard title="Avg. Rating" value="4.8 Star" change="3 reviews" icon="rating" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BarChart />
            <LineChart />
          </div>

          {/* Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders />
            <TopProducts />
          </div>
        </main>
      </div>
    </div>
  );
}