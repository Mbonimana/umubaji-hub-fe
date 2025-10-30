"use client";

import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderData {
  name: string;
  orders: number;
}

const data: OrderData[] = [
  { name: "May", orders: 12 },
  { name: "Jun", orders: 17 },
  { name: "Jul", orders: 14 },
  { name: "Aug", orders: 24 },
  { name: "Sep", orders: 26 },
  { name: "Oct", orders: 32 },
];

export default function LineChartComponent() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800">Orders Over Time</h2>

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
