// src/pages/VendorDashboard.tsx
import { Plus } from 'lucide-react';
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
      {/* === SIDEBAR – FIXED === */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      {/* === RIGHT SECTION – WITH TOP NAVBAR FIXED === */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* === NAVBAR – FIXED === */}
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        {/* === MAIN CONTENT – SCROLLABLE === */}
        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          {/* Add New Product */}
          <div className="mb-6 flex justify-end">
            <button className="bg-[#FFB347] mt-8 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-amber-700 font-medium  mt-100">
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatsCard title="Total Views" value="12,458" change="+12% this month" icon="views" />
            <StatsCard title="Total Sales" value="₦561K" change="+8% this month" icon="sales" />
            <StatsCard title="Total Orders" value="117" change="+15% this month" icon="orders" />
            <StatsCard title="Avg. Rating" value="4.8 Star" change="124 reviews" icon="rating" />
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