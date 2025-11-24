import { useEffect, useState, useMemo } from 'react';
import CustomerSidebar from '../../components/customerDashboard/Sidebar';
import CustomerTopbar from '../../components/customerDashboard/Navbar';
import { Link } from 'react-router-dom';

type OrderItem = {
  product_id: number;
  title?: string;
  price: string;
  quantity: number;
};

type Order = {
  id: number;
  full_name: string;
  created_at: string;
  status: string;
  items: OrderItem[];
  total_amount: string;
  shipping_address: string;
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Load user ID from JWT token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded?.id || null);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setUserId(null);
      }
    }
  }, []);

  // Fetch user orders
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/user/${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userId]);

  const steps: Array<Order['status']> = [
    'Placed',
    'Processing',
    'Shipped',
    'Out for delivery',
    'Delivered',
    'Cancelled'
  ];

  const stepIndex = (status: Order['status']) => steps.findIndex(s => s === status);

  const formatRWF = (amount: number | string) =>
    `RWF ${parseFloat(amount.toString()).toLocaleString('en-RW')}`;

  const myOrders = useMemo(() => orders, [orders]);

  const getItemCount = (items: OrderItem[]) =>
    items.reduce((sum, i) => sum + i.quantity, 0);

  // Function to get status color classes
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-[#E6F7EF] text-[#0F9D58] border border-[#BFE9D6]';
      case 'cancelled':
        return 'bg-[#FDE2E1] text-[#D32F2F] border border-[#F9BDBD]';
      case 'pending':
      case 'processing':
        return 'bg-[#FFF7E6] text-[#AD6800] border border-[#FFE7BA]';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-6">🛒 My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-gray-500">No orders found yet.</div>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Track</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order, idx) => (
                      <tr key={order.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                        <td className="px-4 py-3 font-medium text-[#4B341C]">#{order.id}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {getItemCount(order.items)}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {formatRWF(order.total_amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelected(order)}
                            className="px-3 py-1 rounded-md border border-gray-300 hover:bg-[#4B341C] hover:text-white transition text-sm"
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order drawer */}
          {selected && (
            <div
              className="fixed inset-0 bg-black/30 z-50 flex justify-end"
              onClick={() => setSelected(null)}
            >
              <div
                className="w-full sm:w-[420px] h-full bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="font-semibold text-gray-800">Track Order #{selected.id}</div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-500 text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="p-4 space-y-6 text-sm">
                  <div className="text-gray-500">
                    Placed on {new Date(selected.created_at).toLocaleString()}
                  </div>

                  <div className="space-y-4">
                    {steps.map((step, i) => {
                      const active = i <= stepIndex(selected.status);
                      return (
                        <div key={step} className="flex items-start gap-3">
                          <div
                            className={`w-3 h-3 rounded-full mt-1 ${active ? 'bg-[#4B341C]' : 'bg-gray-300'}`}
                          />
                          <div>
                            <div className={`text-sm ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step}
                            </div>
                            {i < steps.length - 1 && (
                              <div
                                className={`ml-1 mt-1 w-0.5 h-4 ${active ? 'bg-[#4B341C]' : 'bg-gray-200'}`}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{getItemCount(selected.items)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>{formatRWF(selected.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`${getStatusClasses(selected.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  {selected.status.toLowerCase() !== "delivered" && (
                    <Link to="/payment" state={{ orderId: selected.id, amount: selected.total_amount }}>
                      <button
                        onClick={() => alert('Payment system launching soon!')}
                        className="w-full mt-4 py-2 bg-[#4B341C] text-white rounded hover:bg-[#3b2a15] transition"
                      >
                        Pay Now
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
