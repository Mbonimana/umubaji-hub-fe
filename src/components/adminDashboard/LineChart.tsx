import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function LineChart({
  title = 'Platform Revenue & Orders',
}: {
  title?: string;
}) {
  // Data to mimic Figma trend
  const data = [
    { name: 'May', revenue: 450000, orders: 24 },
    { name: 'Jun', revenue: 660000, orders: 66 },
    { name: 'Jul', revenue: 540000, orders: 48 },
    { name: 'Aug', revenue: 900000, orders: 92 },
    { name: 'Sep', revenue: 940000, orders: 98 },
    { name: 'Oct', revenue: 1180000, orders: 118 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-800 font-medium mb-4">{title}</p>
      <div className="h-[320px] rounded-xl bg-[#FBFAF8]">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data} margin={{ top: 20, right: 32, bottom: 20, left: 48 }}>
            <CartesianGrid vertical horizontal={false} strokeDasharray="4 6" stroke="#EADFD4" />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 1200000]}
              tickCount={5}
              tickFormatter={(v) => v.toLocaleString()}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 120]}
              tickCount={5}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip cursor={{ stroke: '#E5E7EB' }} contentStyle={{ borderRadius: 10, borderColor: '#f3f4f6' }} />
            <Line
              type="monotone"
              dataKey="revenue"
              yAxisId="left"
              stroke="#4B341C"
              strokeWidth={2.5}
              dot={{ r: 5, stroke: '#4B341C', fill: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
