import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/vendorDashboard/Sidebar";
import Navbar from "../../components/vendorDashboard/Navbar";
import { Eye, X } from "lucide-react";
import { getBaseUrl } from "../../config/baseUrl";
import Notiflix from "notiflix";

type Item = {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  images: string[];
};

type Order = {
  id: number;
  fullnames: string;
  phone: string;
  address: string;
  status: string;
  created_at: string;
  items: Item[];
  currency?: string;
  total_amount?: string;
};

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const vendorId = user?.id;
  const token = localStorage.getItem("jwtToken");

  const fetchVendorOrders = useCallback(async () => {
    if (!vendorId || !token) {
      setError("Authentication error. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getBaseUrl()}/orders/vendor/${vendorId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data)) setOrders(data);
      else setError("No orders found or invalid response.");
    } catch (err) {
      console.error(err);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [vendorId, token]);

  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);

  const formatRWF = (amount: number) =>
    `RWF ${amount.toLocaleString("en-RW", { minimumFractionDigits: 0 })}`;

  const getOrderTotal = (items: Item[]) =>
    items.reduce((sum, item) => sum + item.subtotal, 0);

  const statusClass = (status: string) =>
    status === "completed"
    ? "bg-green-100 text-green-800 border border-green-200" 
    : status === "paid"
    ? "bg-teal-100 text-teal-800 border border-teal-200"   
    : status === "delivering"
    ? "bg-blue-100 text-blue-800 border border-blue-200"   
    : status === "processing"
    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
    : "bg-red-100 text-red-800 border border-red-200"; 
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">
            Vendor Orders
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500">❌ {error}</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-gray-600 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Products</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="px-4 py-3 font-medium text-[#4B341C]">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{order.fullnames}</td>
                        <td className="px-4 py-3 text-gray-600">{order.address}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <ul className="list-disc list-inside space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700">
                          {formatRWF(getOrderTotal(order.items))}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="flex items-center gap-1 text-xs bg-[#4B341C] hover:bg-[#3b2a15] text-white px-3 py-1 rounded-md"
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

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 bg-white border-t">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Modal for full details */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-md p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-[#4B341C] mb-4">
                  Order #{selectedOrder.id}
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <p><strong>Customer:</strong> {selectedOrder.fullnames}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  <p><strong>Total:</strong> {formatRWF(getOrderTotal(selectedOrder.items))}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#4B341C] mb-2">Products Sold:</h4>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b py-2">
                      <div className="flex items-center gap-2">
                        {item.images?.[0] && (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                      <div>
                        {item.quantity} × {formatRWF(item.unit_price)} = {formatRWF(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clickable vendor action buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${getBaseUrl()}/orders/orders/${selectedOrder.id}/processing`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        const data = await res.json();
                        if (res.ok) {
                          Notiflix.Notify.success(data.message || "Order marked as processing");
                          setSelectedOrder({ ...selectedOrder, status: "processing" });
                          fetchVendorOrders();
                        } else {
                          Notiflix.Notify.failure(data.error || "Failed to update order");
                        }
                      } catch (err) {
                        console.error(err);
                        Notiflix.Notify.failure("Error updating order");
                      }
                    }}
                  >
                    Mark as Processing
                  </button>

                  <button
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 text-sm"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${getBaseUrl()}/orders/orders/${selectedOrder.id}/delivering`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        const data = await res.json();
                        if (res.ok) {
                          Notiflix.Notify.success(data.message || "Order marked as delivering");
                          setSelectedOrder({ ...selectedOrder, status: "delivering" });
                          fetchVendorOrders();
                        } else {
                          Notiflix.Notify.failure(data.error || "Failed to update order");
                        }
                      } catch (err) {
                        console.error(err);
                        Notiflix.Notify.failure("Error updating order");
                      }
                    }}
                  >
                    Mark as Delivering
                  </button>

                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
