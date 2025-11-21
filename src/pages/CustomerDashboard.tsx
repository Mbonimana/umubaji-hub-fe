import CustomerSidebar from '../components/customerDashboard/Sidebar';
import CustomerTopbar from '../components/customerDashboard/Navbar';
import { useEffect, useMemo, useState } from 'react';
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

interface User { id?: number | string; firstname?: string }

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    // mock: would fetch user's recent orders
    const mock = [
      { id: 'O-10231', date: '2025-10-10', total: 54000, status: 'Delivered' },
      { id: 'O-10212', date: '2025-10-06', total: 18000, status: 'Shipped' },
      { id: 'O-10188', date: '2025-09-30', total: 32000, status: 'Processing' },
    ];
    setRecentOrders(mock);
  }, []);

  const ordersData = useMemo(
    () => [
      { m: 'May', orders: 2 },
      { m: 'Jun', orders: 4 },
      { m: 'Jul', orders: 3 },
      { m: 'Aug', orders: 6 },
      { m: 'Sep', orders: 5 },
      { m: 'Oct', orders: 7 },
    ],
    []
  );

  const visitsData = useMemo(
    () => [
      { m: 'May', visits: 12 },
      { m: 'Jun', visits: 16 },
      { m: 'Jul', visits: 12 },
      { m: 'Aug', visits: 24 },
      { m: 'Sep', visits: 26 },
      { m: 'Oct', visits: 32 },
    ],
    []
  );

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Welcome{user?.firstname ? `, ${user.firstname}` : ''}</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-[#333]">4</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-[#333]">3</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <p className="text-2xl font-semibold text-[#333]">8</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500">Site Visits</p>
              <p className="text-2xl font-semibold text-[#333]">5</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-800">Orders per Month</h2>
              <ResponsiveContainer width="100%" height={250}>
                <ReBarChart data={ordersData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="orders" fill="#4B341C" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-800">Site Visits</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 32]} ticks={[0, 8, 16, 24, 32]} tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: 'transparent', fill: 'transparent' }} />
                  <Line type="monotone" dataKey="visits" stroke="#4B341C" strokeWidth={3} dot={{ r: 5, stroke: '#4B341C', fill: '#4B341C' }} activeDot={{ r: 6, fill: '#4B341C' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="p-4 border-b text-gray-700 font-medium">Recent Orders</div>
            <div className="divide-y">
              {recentOrders.map((o) => (
                <div key={o.id} className="p-4 flex items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{o.id}</div>
                  <div className="text-gray-500">{o.date}</div>
                  <div className="text-gray-800">₦{o.total.toLocaleString()}</div>
                  <div className="text-gray-600">{o.status}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
