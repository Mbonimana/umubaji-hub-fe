type Activity = { label: string; time: string; color?: string };

export default function RecentActivitty({
  items = [
    { label: 'New vendor application from Urban Woodworks', time: '2 hours ago', color: 'bg-blue-500' },
    { label: 'Order #ORD-1236 marked as shipped', time: '3 hours ago', color: 'bg-green-500' },
    { label: 'New dispute opened for Order #ORD-145', time: '5 hours ago', color: 'bg-red-500' },
    { label: 'New customer registration: Michael Chen', time: '6 hours ago', color: 'bg-amber-500' },
  ],
  title = 'Recent Activity',
}: {
  items?: Activity[];
  title?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-700 mb-3">{title}</p>
      <div className="space-y-3">
        {items.map((a, i) => (
          <div key={i} className="rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${a.color || 'bg-gray-300'}`}></span>
              <p className="text-sm text-gray-700">{a.label}</p>
            </div>
            <span className="text-xs text-gray-400">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
