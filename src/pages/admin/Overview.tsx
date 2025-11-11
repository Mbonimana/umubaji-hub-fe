import { Users, ShoppingCart, DollarSign, Store } from 'lucide-react';
import LineChart from '../../components/adminDashboard/LineChart';
import PieChart from '../../components/adminDashboard/PieChart';
import Vendors from '../../components/adminDashboard/Vendors';
import RecentActivitty from '../../components/adminDashboard/RecentActivitty';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { getBaseUrl } from '../../config/baseUrl';

interface StatItem {
  title: string;
  value: number;
  change: string;
  icon: React.ReactNode;
  highlight?: string;
  loading?: boolean;
}

export default function AdminOverview() {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [, setPrevCustomerCount] = useState<number>(0);
  const [customerChange, setCustomerChange] = useState<number>(0);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        jwtDecode(token);

        const response = await fetch(`${getBaseUrl()}/users/allcustomers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        const prev = customerCount;
        setPrevCustomerCount(prev);
        setCustomerCount(data.count);
        setCustomerChange(data.count - prev);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomerCount(0);
        setCustomerChange(0);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const stats: StatItem[] = [
    { title: 'Total Vendors', value: 248, change: '+12 this month', icon: <Store className="w-5 h-5" /> },
    { 
      title: 'Total Customers', 
      value: customerCount,
      change: customerChange >= 0 ? `+${customerChange} this month` : `${customerChange} this month`,
      icon: <Users className="w-5 h-5" />,
      loading: loadingCustomers,
    },
    { title: 'Total Revenue', value: 5200000, change: '+18% this month', icon: <DollarSign className="w-5 h-5" /> },
    { title: 'Active Orders', value: 87, change: 'Processing', icon: <ShoppingCart className="w-5 h-5" />, highlight: 'muted' },
  ];

  const StatsCards = ({ items }: { items: StatItem[] }) => (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
          {/* Title on top */}
          <p className="text-gray-500 text-sm mb-2">{item.title}</p>

          {/* Icon, value, change on the same horizontal line */}
          <div className="flex items-center justify-between space-x-3">
            <span className="text-xl flex items-center">{item.icon}</span>
            <span className="text-xl font-semibold">
              {item.loading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              ) : (
                item.value
              )}
            </span>
            <span className="text-green-500 text-xs">{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );

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
