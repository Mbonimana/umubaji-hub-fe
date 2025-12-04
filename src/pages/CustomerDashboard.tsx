import CustomerSidebar from "../components/customerDashboard/Sidebar";
import CustomerTopbar from "../components/customerDashboard/Navbar";
import { useEffect, useState } from "react";
import { getBaseUrl } from "../config/baseUrl";
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
} from "recharts";
import { jwtDecode } from "jwt-decode";

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
  const [loading, setLoading] = useState(false); // ✅ fix: read & write

  // Decode user from JWT
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded: DecodedUser = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  // Fetch customer orders
  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${getBaseUrl()}/orders/customer/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data.orders)) setOrders(data.orders);
        else setOrders([]);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // Stats
  const completedOrders = orders.filter(
    (o) => o.status.toLowerCase() === "completed"
  ).length;

  const processingOrders = orders.filter(
    (o) => o.status.toLowerCase() === "processing"
  ).length;

  const deliveringOrders = orders.filter(
    (o) => o.status.toLowerCase() === "delivering"
  ).length;

  const paidOrders = orders.filter(
    (o) => o.status.toLowerCase() === "paid"
  ).length;

  // Static chart data
  const ordersData = [
    { m: "May", orders: 2 },
    { m: "Jun", orders: 4 },
    { m: "Jul", orders: 3 },
    { m: "Aug", orders: 6 },
    { m: "Sep", orders: 5 },
    { m: "Oct", orders: 7 },
  ];

  const visitsData = [
    { m: "May", visits: 12 },
    { m: "Jun", visits: 16 },
    { m: "Jul", visits: 12 },
    { m: "Aug", visits: 24 },
    { m: "Sep", visits: 26 },
    { m: "Oct", visits: 32 },
  ];

  // Spinner SVG component
  const Spinner = () => (
    <svg
      className="animate-spin h-6 w-6 text-gray-600 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">
            Welcome{user?.firstname ? `, ${user.firstname}` : ""}
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 text-center">Completed</p>
              <p className="text-2xl font-semibold text-center">
                {loading ? <Spinner /> : completedOrders}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 text-center">Processing</p>
              <p className="text-2xl font-semibold text-center">
                {loading ? <Spinner /> : processingOrders}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 text-center">Delivering</p>
              <p className="text-2xl font-semibold text-center">
                {loading ? <Spinner /> : deliveringOrders}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
              <p className="text-sm text-gray-500 text-center">Unprocessed</p>
              <p className="text-2xl font-semibold text-center">
                {loading ? <Spinner /> : paidOrders}
              </p>
            </div>
          </div>

          {/* TWO GRAPHS INSTEAD OF TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
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
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#4B341C"
                    strokeWidth={3}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
