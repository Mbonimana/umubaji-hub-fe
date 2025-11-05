import { useState } from 'react';

export default function AdminCustomers() {
  const [selected, setSelected] = useState<null | { name: string; email: string; orders: number; joined: string }>(null);
  const [show, setShow] = useState(false);

  const customers = [
    { name: 'Aline Uwase', email: 'aline@example.com', orders: 12, joined: '2024-02-18' },
    { name: 'Jean Bosco', email: 'jbosco@example.com', orders: 7, joined: '2024-05-02' },
    { name: 'Eric N.', email: 'eric@example.com', orders: 3, joined: '2024-07-21' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-5">
        <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
        <div className="flex items-center gap-2">
          <input placeholder="Search customers" className="border rounded-md px-3 py-2 text-sm" />
          <button className="bg-[#4B341C] text-white px-4 py-2 rounded-lg text-sm">Search</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-700">Customer List</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Orders</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.email} className="text-gray-700">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3">{new Date(c.joined).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-3 py-1.5 rounded-md border text-gray-700"
                        onClick={() => { setSelected(c); setShow(true); }}
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
                <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
                <p className="text-sm text-gray-500">Joined {new Date(selected.joined).toLocaleDateString()}</p>
              </div>
              <button className="px-3 py-1.5 rounded-md border text-gray-700" onClick={() => { setShow(false); setSelected(null); }}>Close</button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span>{selected.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selected.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Orders</span><span>{selected.orders}</span></div>
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
