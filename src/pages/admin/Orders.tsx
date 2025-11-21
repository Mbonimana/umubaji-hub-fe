import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";
import Notiflix from "notiflix";

type Vendor = {
  id: number;
  full_admin_name: string;
  phone?: string;
  company_name?: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
  user_id: number;
};

type OrderItem = {
  product_id: number;
  vendor_id: number;
  quantity: number;
  price: string;
};

type Order = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_id: number;
  shipping_address: string;
  payment_method: string;
  total_amount: number | string;
  status: string;
  created_at: string;
  items: OrderItem[];
};

// Utility
const formatRWF = (v: string | number) => `RWF ${parseFloat(v.toString()).toLocaleString("en-RW")}`;

const statusColor = (status: string) =>
  status === "completed"
    ? "bg-green-50 text-green-700"
    : status === "processing"
      ? "bg-blue-50 text-blue-700"
      : status === "cancelled"
        ? "bg-red-50 text-red-600"
        : "bg-yellow-50 text-yellow-700";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Record<number, Vendor>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch orders", error);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      Notiflix.Notify.success(" Status updated.");
      fetchOrders();
    } catch (err) {
      console.error("Error:", err);
      Notiflix.Notify.failure("❌ Failed to update status.");
    }
  };

  const loadOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);

    // Fetch product and vendor info
    const detailedProducts: Product[] = [];
    const vendorMap: Record<number, Vendor> = {};

    for (const item of order.items) {
      try {
        // Fetch product
        const productRes = await axios.get(`http://localhost:3000/api/products/getProduct/${item.product_id}`);
        const product = productRes.data;
        detailedProducts.push({ ...product, quantity: item.quantity });

        // Fetch vendor
        if (!vendorMap[item.vendor_id]) {
          const vendorRes = await axios.get(`http://localhost:3000/api/users/${item.vendor_id}`);
          vendorMap[item.vendor_id] = vendorRes.data;
        }

      } catch (err) {
        console.error("❌ Error fetching product/vendor", err);
      }
    }

    setProducts(detailedProducts);
    setVendors(vendorMap);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setProducts([]);
    setVendors({});
  };

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4B341C]">Manage Orders</h2>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Recent Orders</div>
        <div className="overflow-scroll">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-2 font-bold text-[#4B341C]">#{o.id}</td>
                  <td className="px-4 py-2">{o.full_name}</td>
                  <td className="px-4 py-2">{formatRWF(o.total_amount)}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => loadOrderDetails(o)}
                      className="text-[#4B341C] border rounded px-2 py-1 hover:bg-[#f1e9dc]"
                    >
                      <Eye className="w-4 h-4 inline" /> View
                    </button>
                    <select
                      className="text-xs border px-2 py-1 rounded"
                      value={o.status}
                      onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Order Details */}
      {modalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 py-10 px-4">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative shadow-md overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#4B341C] mb-4">
              Order #{selectedOrder.id} Details
            </h3>

            <div className="grid grid-cols-2 text-sm gap-2 mb-6">
              <p><strong>Customer:</strong> {selectedOrder.full_name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.shipping_address}</p>
              <p><strong>Placed:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded text-xs ${statusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
            </div>

            <h4 className="text-sm font-semibold text-[#4B341C] mb-2">Products Ordered:</h4>
            <div className="space-y-4">
              {products.map((product, idx) => (
                <div key={idx} className="border p-3 rounded flex gap-4 bg-gray-50">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="text-sm flex-1">
                    <p className="text-[#4B341C] font-semibold">{product.name}</p>
                    <p className="text-gray-600">Price: {formatRWF(product.price)}</p>
                    <p className="text-gray-600">Quantity: {selectedOrder.items.find(i => i.product_id === product.id)?.quantity}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Vendor: {vendors?.[product.user_id]?.full_admin_name || "Unknown"}<br />
                      Phone: {vendors?.[product.user_id]?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-gray-600">No products found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}