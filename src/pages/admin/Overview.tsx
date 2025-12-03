import { ShoppingCart, Wallet, Repeat } from 'lucide-react';
import LineChart from '../../components/adminDashboard/LineChart';
import PieChart from '../../components/adminDashboard/PieChart';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { getBaseUrl } from '../../config/baseUrl';

interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  highlight?: string;
  loading?: boolean;
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);

  const [totalAmount, setTotalAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [totalOrders, setotalOrders] = useState(0);

  const formatRWF = (value: number) => `RF ${value.toLocaleString('en-RW')}`;

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const fetchTotals = async () => {
      setLoading(true);
      try {
        jwtDecode(token);

        const [totalRes, platformRes, payoutRes, orderRes] = await Promise.all([
          fetch(`${getBaseUrl()}/payouts/total-amount`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${getBaseUrl()}/payouts/total-platform-fee`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${getBaseUrl()}/payouts/total-payout`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${getBaseUrl()}/orders/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const totalData = await totalRes.json();
        const platformData = await platformRes.json();
        const payoutData = await payoutRes.json();
        const orderData = await orderRes.json();

        setTotalAmount(Number(totalData.totalAmount || 0));
        setPlatformFee(Number(platformData.totalPlatformFee || 0));
        setPayoutAmount(Number(payoutData.totalPayout || 0));

        // ✅ FIXED: Correctly count orders
        setotalOrders(orderData.length || 0);

      } catch (error) {
        console.error('Error fetching totals:', error);
        setTotalAmount(0);
        setPlatformFee(0);
        setPayoutAmount(0);
        setotalOrders(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const stats: StatItem[] = [
    {
      title: 'Total Transactions',
      value: formatRWF(totalAmount),
      icon: <Repeat className="w-5 h-5" />,
      loading,
    },

    {
      title: 'Total Payout Amount',
      value: formatRWF(payoutAmount),
      icon: <Wallet className="w-5 h-5" />,
      loading,
    },
    {
      title: 'Platform Revenue (5%)',
      value: formatRWF(platformFee),
      icon: <Wallet className="w-5 h-5" />,
      loading,
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCart className="w-5 h-5" />,
      highlight: 'muted',
      loading,
    },
  ];

  const StatsCards = ({ items }: { items: StatItem[] }) => (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4 flex flex-col ">
       
             <p className="text-gray-500 text-sm mb-2">{item.title}</p>

          <div className="flex items-center space-x-3">
            <span className="text-xl ">{item.icon}</span>
            <span className="text-xl font-semibold">
              {item.loading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              ) : (
                item.value
              )}
            </span>
            {item.change && <span className="text-green-500 text-xs">{item.change}</span>}
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
    </div>
  );
}
