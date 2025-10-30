// src/components/vendor/RecentOrders.tsx
const orders = [
  { name: 'Chioma A.', product: 'Modern Dining Table', price: 185000, status: 'Processing' },
  { name: 'David O.', product: 'Executive Office Chair', price: 95000, status: 'Shipped' },
  { name: 'Fatima M.', product: 'Coffee Table Set', price: 75000, status: 'Delivered' },
];

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        <button className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((o, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900">{o.name}</p>
              <p className="text-sm text-gray-600">{o.product}</p>
              <p className="text-sm font-semibold text-[#4B341C]">₦{o.price.toLocaleString()}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                o.status === 'Processing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : o.status === 'Shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}