import { Users, ShoppingCart, DollarSign, Store } from 'lucide-react';
import StatsCards, { type StatItem } from '../../components/adminDashboard/StatsCards';
import LineChart from '../../components/adminDashboard/LineChart';
import PieChart from '../../components/adminDashboard/PieChart';
import Vendors from '../../components/adminDashboard/Vendors';
import RecentActivitty from '../../components/adminDashboard/RecentActivitty';

export default function AdminOverview() {
  const stats: StatItem[] = [
    { title: 'Total Vendors', value: '248', change: '+12 this month', icon: <Store className="w-5 h-5" /> },
    { title: 'Total Customers', value: '1,842', change: '+156 this month', icon: <Users className="w-5 h-5" /> },
    { title: 'Total Revenue', value: '₦5.2M', change: '+18% this month', icon: <DollarSign className="w-5 h-5" /> },
    { title: 'Active Orders', value: '87', change: 'Processing', icon: <ShoppingCart className="w-5 h-5" />, highlight: 'muted' },
  ];

  return (
    <div className="space-y-6">
      <StatsCards items={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart />
        <PieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Vendors />
        <RecentActivitty />
      </div>
    </div>
  );
}
