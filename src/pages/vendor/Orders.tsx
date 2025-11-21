import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/vendorDashboard/Sidebar";
import Navbar from "../../components/vendorDashboard/Navbar";
import { Eye, X } from "lucide-react";

type Item = {
  product_id: number;
  quantity: number;
  price: string;
};

type Order = {
  id: number;
  full_name: string;
  phone: string;
  shipping_address: string;
  status: string;
  created_at: string;
  items: Item[];
};

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const vendorId = user?.id;

  const fetchVendorOrders = useCallback(async () => {
    if (!vendorId) {
      setError("Vendor ID not found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/orders/vendor/${vendorId}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("❌ Error fetching vendor orders:", err);
      setError("Error fetching orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);

  const formatRWF = (amount: number) =>
    `RWF ${amount.toLocaleString("en-RW", { minimumFractionDigits: 0 })}`;

  const getOrderTotal = (items: Item[]) =>
    items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  const statusClass = (status: string) =>
    status === "paid"
      ? "bg-[#E6F7EF] text-[#0F9D58] border border-[#BFE9D6]"
      : "bg-[#FDEDEE] text-[#D93025] border border-[#F7C2C6]";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Navbar */}
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Vendor Orders</h1>

          {loading ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500">❌ {error}</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders found for your products.</p>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Shipping</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Products</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="px-4 py-3 font-medium text-[#4B341C]">#{order.id}</td>
                        <td className="px-4 py-3 text-gray-800">{order.full_name}</td>
                        <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                        <td className="px-4 py-3 text-gray-600">{order.shipping_address}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <ul className="list-disc list-inside space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                Product #{item.product_id} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700">
                          {formatRWF(getOrderTotal(order.items))}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="flex items-center gap-1 text-xs bg-[#4B341C] hover:bg-[#3b2a15] text-white px-3 py-1 rounded-md transition"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODAL to display full order details */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
              <div
                className="bg-white w-full max-w-lg rounded-md p-6 relative shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={20} />
                </button>
                <h3 className="text-xl font-bold text-[#4B341C] mb-4">
                  Order #{selectedOrder.id} Details
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Customer:</strong> {selectedOrder.full_name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Shipping:</strong> {selectedOrder.shipping_address}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-[#4B341C] mb-2">Products Sold:</h4>
                  <ul className="text-sm space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between border-b pb-1 text-gray-700"
                      >
                        <span>Product #{item.product_id}</span>
                        <span>
                          {item.quantity} × {formatRWF(item.price)} ={" "}
                          {formatRWF(item.quantity * parseFloat(item.price))}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 font-semibold text-base text-[#4B341C]">
                    Total: {formatRWF(getOrderTotal(selectedOrder.items))}
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