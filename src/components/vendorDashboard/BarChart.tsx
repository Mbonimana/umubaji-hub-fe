"use client";

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  name: string;
  sales: number;
}

const data: SalesData[] = [
  { name: "May", sales: 48000 },
  { name: "Jun", sales: 66000 },
  { name: "Jul", sales: 54000 },
  { name: "Aug", sales: 90000 },
  { name: "Sep", sales: 95000 },
  { name: "Oct", sales: 115000 },
];

export default function BarChartComponent() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800">Monthly Sales</h2>

      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data} barSize={40}>
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
            cursor={{ fill: "transparent" }}
            contentStyle={{
              borderRadius: "10px",
              borderColor: "#f3f4f6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />
          <Bar dataKey="sales" fill="#4B341C" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
