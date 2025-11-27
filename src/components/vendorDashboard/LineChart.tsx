"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getBaseUrl } from "../../config/baseUrl";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Order {
  id: number;
  created_at: string; // MUST exist in your API
}

interface ChartData {
  name: string;
  orders: number;
}

export default function LineChartComponent() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch + Transform Orders ----------------
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const vendorId = (() => {
      try {
        const parts = token.split(".");
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        return payload.id || payload.userId || null;
      } catch {
        return null;
      }
    })();

    if (!vendorId) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get<Order[]>(
          `${getBaseUrl()}/orders/vendor/${vendorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orders = res.data;

        // ---------------- Group orders by month ----------------
        const monthsMap: Record<string, number> = {};

        orders.forEach((order) => {
          const date = new Date(order.created_at);
          const monthName = date.toLocaleString("en-US", { month: "short" });

          monthsMap[monthName] = (monthsMap[monthName] || 0) + 1;
        });

        // Convert to array compatible with recharts
        const finalData = Object.keys(monthsMap).map((month) => ({
          name: month,
          orders: monthsMap[month],
        }));

        setData(finalData);
      } catch (error) {
        console.error("Failed to load orders for chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ---------------- Loading Placeholder ----------------
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 h-[250px] flex items-center justify-center">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800">
        Orders Over Time
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />

          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ stroke: "#E5E7EB" }}
            contentStyle={{
              borderRadius: "10px",
              borderColor: "#f3f4f6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#4B341C"
            strokeWidth={2.5}
            dot={{ fill: "#4B341C", r: 5 }}
            activeDot={{ r: 6 }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
