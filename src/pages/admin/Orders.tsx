export default function AdminOrders() {
  const orders = [
    { id: 'ORD-10021', customer: 'Aline Uwase', vendor: 'Kigali Woodworks', amount: 420000, status: 'Processing' },
    { id: 'ORD-10022', customer: 'Jean Bosco', vendor: 'Nyamirambo Crafts', amount: 180000, status: 'Completed' },
    { id: 'ORD-10023', customer: 'Eric N.', vendor: 'Bugesera Doors', amount: 320000, status: 'Pending' },
  ];

  const currency = (v: number) => `₦${v.toLocaleString()}`;
  const badge = (s: string) =>
    s === 'Completed'
      ? 'bg-green-50 text-green-700'
      : s === 'Processing'
      ? 'bg-blue-50 text-blue-700'
      : 'bg-yellow-50 text-yellow-700';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-5">
        <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
        <div className="flex items-center gap-2">
          <input placeholder="Search orders" className="border rounded-md px-3 py-2 text-sm " />
          <button className="bg-[#4B341C] text-white px-4 py-2 rounded-lg text-sm ">Export</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-700">Recent Orders</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Vendor</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id} className="text-gray-700">
                  <td className="px-4 py-3">{o.id}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3">{o.vendor}</td>
                  <td className="px-4 py-3">{currency(o.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs ${badge(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-md border text-gray-700">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
