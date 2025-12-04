import CustomerSidebar from '../components/customerDashboard/Sidebar';
import CustomerTopbar from '../components/customerDashboard/Navbar';
import { useEffect, useMemo, useState } from 'react';
import { getBaseUrl } from '../config/baseUrl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as ReBarChart,
  Bar,
} from 'recharts';
import { jwtDecode } from 'jwt-decode';

interface OrderItem {
  quantity: number;
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  total_amount: string;
  items: OrderItem[];
}

interface DecodedUser {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  user_role: string;
  [key: string]: any;
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<DecodedUser | null>(null);

  // Load user from JWT token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded: DecodedUser = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setUser(null);
      }
    }
  }, []);

  // Fetch orders for logged-in user
  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/orders/customer/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // Get recent orders (last 5)
  const recentOrders = useMemo(() => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sorted.slice(0, 5).map((o) => ({
      id: o.id,
      date: new Date(o.created_at).toLocaleDateString('en-GB'),
      total: parseFloat(o.total_amount),
      status: o.status,
    }));
  }, [orders]);

  // Dummy chart data
  const ordersData = [
    { m: 'May', orders: 2 },
    { m: 'Jun', orders: 4 },
    { m: 'Jul', orders: 3 },
    { m: 'Aug', orders: 6 },
    { m: 'Sep', orders: 5 },
    { m: 'Oct', orders: 7 },
  ];

  const visitsData = [
    { m: 'May', visits: 12 },
    { m: 'Jun', visits: 16 },
    { m: 'Jul', visits: 12 },
    { m: 'Aug', visits: 24 },
    { m: 'Sep', visits: 26 },
    { m: 'Oct', visits: 32 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <CustomerSidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <CustomerTopbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">
            Welcome{user?.firstname ? `, ${user.firstname}` : ''}
          </h1>


          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {/* Total Orders */}
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 flex justify-center">Total Orders</p>
              <p className="text-2xl font-semibold text-[#333] flex justify-center">{orders.length}</p>
            </div>
            
             {/* Completed Orders */}
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 flex justify-center">Completed Orders</p>
               
              <p className="text-2xl font-semibold text-[#333] flex justify-center">
                {orders.filter(o => o.status.toLowerCase() === 'completed').length}

              </p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 flex justify-center">Pending Orders</p>
              <p className="text-2xl font-semibold text-[#333] flex justify-center">
                {orders.filter(o => o.status.toLowerCase() === 'pending').length}
              </p>
            </div>

            {/* Cancelled Orders */}
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 flex justify-center">Cancelled Orders</p>
              <p className="text-2xl font-semibold text-[#333] flex justify-center">
                {orders.filter(o => o.status.toLowerCase() === 'cancelled').length}
              </p>
            </div>

           
          </div>



          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-800">Orders per Month</h2>
              <ResponsiveContainer width="100%" height={250}>
                <ReBarChart data={ordersData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="m" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#4B341C" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-800">Site Visits</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="m" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#4B341C" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="p-4 border-b text-gray-700 font-medium">Recent Orders</div>
            <div className="divide-y">
              {recentOrders.length > 0 ? (
                recentOrders.map(o => (
                  <div key={o.id} className="p-4 flex items-center justify-between text-sm">
                    <div className="font-medium text-gray-800">#{o.id}</div>
                    <div className="text-gray-500">{o.date}</div>
                    <div className="text-gray-800">RWF {o.total.toLocaleString()}</div>
                    <div className="text-gray-600">{o.status}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-sm">No recent orders found</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
