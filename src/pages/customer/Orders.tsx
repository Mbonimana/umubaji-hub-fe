import { useEffect, useMemo, useState } from 'react';
import CustomerSidebar from '../../components/customerDashboard/Sidebar';
import CustomerTopbar from '../../components/customerDashboard/Navbar';

interface OrderItem {
  id: string;
  userId: string | number;
  date: string;
  total: number;
  products: number;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selected, setSelected] = useState<OrderItem | null>(null);
  const [userId, setUserId] = useState<string | number | null>(null);

  useEffect(() => {
    const uRaw = localStorage.getItem('user');
    if (uRaw) {
      try {
        const u = JSON.parse(uRaw);
        setUserId(u?.id ?? u?.email ?? 'me');
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Mock orders; replace with API call later using userId
    const mock: OrderItem[] = [
      { id: 'C-10021', userId: 'me', date: '2025-10-09 14:22', products: 3, total: 42000, status: 'Delivered' },
      { id: 'C-10019', userId: 'me', date: '2025-10-07 10:05', products: 2, total: 18000, status: 'Out for delivery' },
      { id: 'C-10012', userId: 'me', date: '2025-10-01 09:41', products: 1, total: 12000, status: 'Shipped' },
      { id: 'C-9988', userId: 2, date: '2025-09-27 16:30', products: 6, total: 96000, status: 'Processing' },
    ];
    setOrders(mock);
  }, []);

  const myOrders = useMemo(() => orders.filter(o => String(o.userId) === String(userId)), [orders, userId]);

  const steps: Array<OrderItem['status']> = [
    'Placed',
    'Processing',
    'Shipped',
    'Out for delivery',
    'Delivered',
  ];

  const stepIndex = (status: OrderItem['status']) => Math.max(0, steps.indexOf(status));

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">My Orders</h1>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 max-w-sm">
              <input placeholder="Search orders" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f9fafb] text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Products</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Track</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((o, idx) => (
                    <tr key={o.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                      <td className="px-4 py-3 font-medium text-gray-800">{o.id}</td>
                      <td className="px-4 py-3 text-gray-600">{o.date}</td>
                      <td className="px-4 py-3 text-gray-800">{o.products}</td>
                      <td className="px-4 py-3 text-gray-800">₦{o.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === 'Delivered' ? 'bg-[#E6F7EF] text-[#0F9D58] border border-[#BFE9D6]' : 'bg-[#FFF7E6] text-[#AD6800] border border-[#FFE7BA]' }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(o)} className="px-3 py-1 rounded-md border border-gray-300 hover:bg-[#4B341C] hover:text-white transition text-sm">Track</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tracking drawer */}
          {selected && (
            <div className="fixed inset-0 bg-black/20 z-50 flex justify-end" onClick={() => setSelected(null)}>
              <div className="w-full sm:w-[420px] h-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="font-semibold text-gray-800">Track {selected.id}</div>
                  <button onClick={() => setSelected(null)} className="text-gray-500">Close</button>
                </div>
                <div className="p-4 space-y-6">
                  <div className="text-sm text-gray-500">Placed on {selected.date}</div>

                  <div className="space-y-4">
                    {steps.map((s, i) => {
                      const active = i <= stepIndex(selected.status);
                      return (
                        <div key={s} className="flex items-start gap-3">
                          <div className={`mt-1 w-3 h-3 rounded-full ${active ? 'bg-[#4B341C]' : 'bg-gray-300'}`} />
                          <div>
                            <div className={`text-sm ${active ? 'text-gray-900' : 'text-gray-400'}`}>{s}</div>
                            {i < steps.length - 1 && (
                              <div className={`ml-1 mt-1 w-0.5 h-4 ${active ? 'bg-[#4B341C]' : 'bg-gray-200'}`}></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between py-1"><span>Items</span><span>{selected.products}</span></div>
                    <div className="flex justify-between py-1"><span>Total</span><span>₦{selected.total.toLocaleString()}</span></div>
                    <div className="flex justify-between py-1"><span>Status</span><span>{selected.status}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
