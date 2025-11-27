"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Notiflix from "notiflix";
import { getBaseUrl } from "../../config/baseUrl";

type Order = {
  id: number;
  customer_id: number;
  vendor_id: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_method: string;
  platform_fee: number;
  created_at: string;
  updated_at: string;
  full_name: string;
  phone: string;
  shipping_address: string;
  instructions?: string;
  paid_out: boolean;
  payout_amount: number;
};

// Utility
const formatRWF = (v: number | string) =>
  `RWF ${parseFloat(v.toString()).toLocaleString("en-RW")}`;

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        Notiflix.Notify.failure("No admin token found. Please login.");
        return;
      }

      const res = await axios.get(`${getBaseUrl()}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure we always have an array
      const ordersArray = Array.isArray(res.data) ? res.data : [];
      setOrders(ordersArray);
    } catch (error: any) {
      console.error(" Failed to fetch orders", error);
      Notiflix.Notify.failure(error.response?.data?.error || "Failed to load orders.");
      setOrders([]);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4B341C]">Orders</h2>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">
          Recent Orders
        </div>
        <div className="overflow-scroll">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Payment Method</th>
                <th className="px-4 py-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-2 font-bold text-[#4B341C]">#{o.id}</td>
                    <td className="px-4 py-2">{o.full_name}</td>
                    <td className="px-4 py-2">{formatRWF(o.total_amount)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${statusColor(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{o.payment_status}</td>
                    <td className="px-4 py-2">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{o.payment_method}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => viewOrderDetails(o)}
                        className="text-[#4B341C] border rounded px-2 py-1 hover:bg-[#f1e9dc]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-600">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Order Details */}
      {modalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 py-10 px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative shadow-md overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#4B341C] mb-4">
              Order #{selectedOrder.id} Details
            </h3>

            <div className="grid grid-cols-2 text-sm gap-2 mb-4">
              <p>
                <strong>Customer:</strong> {selectedOrder.full_name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.shipping_address}
              </p>
              <p>
                <strong>Placed:</strong>{" "}
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Payment Status:</strong> {selectedOrder.payment_status}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.payment_method}
              </p>
              <p>
                <strong>Instructions:</strong>{" "}
                {selectedOrder.instructions || "N/A"}
              </p>
            </div>

            <p>
              <strong>Platform Fee:</strong> {formatRWF(selectedOrder.platform_fee)}
            </p>
            <p>
              <strong>Payout Amount:</strong> {formatRWF(selectedOrder.payout_amount)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
