// src/components/vendor/TopProducts.tsx
const products = [
  { name: 'Dining Table', sales: 23, revenue: 450000 },
  { name: 'Office Chair', sales: 45, revenue: 380000 },
  { name: 'Bookshelf', sales: 18, revenue: 285000 },
  { name: 'Coffee Table', sales: 31, revenue: 195000 },
];

export default function TopProducts() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-gray-900">Top Products</h3>
        <button className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {products.map((p, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-600">{p.sales} sales</p>
            </div>
            <p className="font-semibold text-amber-600">₦{p.revenue.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}