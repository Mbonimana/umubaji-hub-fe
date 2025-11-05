import { useState } from 'react';

export default function AdminProducts() {
  const [selected, setSelected] = useState<null | { name: string; sku: string; price: number; stock: number; category: string; vendor: string }>(null);
  const [show, setShow] = useState(false);

  const products = [
    { name: 'Oak Dining Table', sku: 'ODT-001', price: 420000, stock: 8, category: 'Furniture', vendor: 'Kigali Woodworks' },
    { name: 'Mahogany Door', sku: 'MD-204', price: 180000, stock: 21, category: 'Doors', vendor: 'Bugesera Doors' },
    { name: 'Custom Bookshelf', sku: 'CB-118', price: 320000, stock: 4, category: 'Custom', vendor: 'Nyamirambo Crafts' },
  ];

  const currency = (v: number) => `₦${v.toLocaleString()}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary mt-5">Products</h2>
       
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-700">Product Catalog</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.sku} className="text-gray-700">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.sku}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{currency(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-3 py-1.5 rounded-md bg-[#4B341C] text-white"
                        onClick={() => { setSelected(p); setShow(true); }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShow(false); setSelected(null); }} />
          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
                <p className="text-sm text-gray-500">From vendor: {selected.vendor}</p>
              </div>
              <button className="px-3 py-1.5 rounded-md border text-gray-700" onClick={() => { setShow(false); setSelected(null); }}>Close</button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span>{selected.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">SKU</span><span>{selected.sku}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Category</span><span>{selected.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Price</span><span>{currency(selected.price)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Stock</span><span>{selected.stock}</span></div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="px-3 py-1.5 rounded-md border text-gray-700" onClick={() => { setShow(false); setSelected(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
