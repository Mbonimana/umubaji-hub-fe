import { useEffect, useState } from "react";
import CustomerSidebar from "../../components/customerDashboard/Sidebar";
import CustomerTopbar from "../../components/customerDashboard/Navbar";
import { getBaseUrl } from "../../config/baseUrl";

type OrderItem = {
  product_id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
  photo?: string;
};

type Order = {
  id: number;
  fullnames: string;
  created_at: string;
  status: string;
  items: OrderItem[];
  total_amount: string;
  address: string;
  phone: string;
  vendor_name?: string;
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const formatRWF = (amount: string | number) =>
    `RWF ${parseFloat(amount.toString()).toLocaleString("en-RW")}`;
  const getItemCount = (items: OrderItem[]) =>
    items.reduce((sum, i) => sum + i.quantity, 0);
const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivering":
      return "bg-blue-100 text-blue-800 border border-blue-200" ; 
    case "paid":
      return "bg-green-100 text-green-800 border border-green-200";    
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-200";       
    case "processing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border border-green-200";     
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";     
  }
};

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded?.id || null);
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/orders/customer/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        });
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, [userId]);

  // Complete order
  const completeOrder = async (orderId: number) => {
    try {
      const res = await fetch(`${getBaseUrl()}/orders/order/complete/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to complete order");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Delivered" } : o))
      );
      setDropdownOpen(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <CustomerSidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <CustomerTopbar />
        </div>

        <main className="flex-1 pt-20 p-6 flex flex-col">
          <h1 className="text-2xl font-semibold text-[#4B341C] mb-6"> My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-gray-500 flex-1 flex items-center justify-center">
              No orders found yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-100 flex-1 flex flex-col overflow-hidden">
              <div className="overflow-x-auto flex-1">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order, idx) => (
                      <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]"}>
                        <td className="px-4 py-3 font-medium text-[#4B341C]">#{order.id}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{getItemCount(order.items)}</td>
                        <td className="px-4 py-3 text-gray-800">{formatRWF(order.total_amount)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 relative">
                          <button
                            className="px-2 py-1 text-gray-700 hover:text-black"
                            onClick={() =>
                              setDropdownOpen(dropdownOpen === order.id ? null : order.id)
                            }
                          >
                            ⋮
                          </button>

                          {dropdownOpen === order.id && (
                            <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded z-50 p-4 animate-fadeIn max-h-[70vh] overflow-y-auto">
                              <div className="font-semibold text-gray-700 mb-2">Order Details</div>
                              {order.vendor_name && (
                                <div className="text-sm text-gray-500 mb-2">
                                  Vendor: {order.vendor_name}
                                </div>
                              )}
                              <div className="text-sm text-gray-500 mb-2">
                                Delivery To: {order.address}
                              </div>
                              <div className="border-t border-gray-200 my-2"></div>
                              <ul className="space-y-2">
                                {order.items.map((item) => (
                                  <li
                                    key={item.product_id}
                                    className="flex items-center gap-2 border rounded p-2 shadow-sm"
                                  >
                                    <img
                                      src={item.photo || "/placeholder.png"}
                                      alt={item.product_name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-700">{item.product_name}</p>
                                      <p className="text-gray-500 text-xs">
                                        {item.quantity} × {formatRWF(item.unit_price)} ={" "}
                                        {formatRWF(item.subtotal)}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>

                              {order.status.toLowerCase() !== "delivered" && (
                                <button
                                  onClick={() => completeOrder(order.id)}
                                  className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                  Mark as Complete
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
