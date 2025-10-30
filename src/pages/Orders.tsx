import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';

export default function Orders() {
  const stats = [
    { title: 'Total orders', value: 25430, pct: 80, ring: '#3B82F6' },
    { title: 'Active orders', value: 23210, pct: 75, ring: '#ffb347' }, // secondary
    { title: 'Complete orders', value: 20210, pct: 70, ring: '#10B981' }, // accent
    { title: 'Cancelled orders', value: 10201, pct: 50, ring: '#EF4444' },
  ];

  const orders = [
    { id: '267400', customer: 'Ralph Edwards', phone: '907.555.0100', date: '12-07-2023 23:26', products: 20, amount: 328.85, status: 'Paid' },
    { id: '558612', customer: 'Theresa Webb', phone: '219.555.0101', date: '12-30-2023 05:18', products: 12, amount: 854.08, status: 'Paid' },
    { id: '558613', customer: 'Cameron Williamson', phone: '203.515.0106', date: '11-30-2023 23:14', products: 8, amount: 106.58, status: 'Due' },
    { id: '267401', customer: 'Cameron Williamson', phone: '316.515.0106', date: '10-27-2023 07:52', products: 20, amount: 782.01, status: 'Due' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      {/* Right */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top navbar */}
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        {/* Content */}
        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Orders</h1>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {stats.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-5 shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{s.title}</p>
                    <p className="text-2xl font-semibold text-[#333]">{s.value.toLocaleString()}</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
                      <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke={s.ring} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${s.pct}, 100`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">{s.pct}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 max-w-sm">
              <input placeholder="Search" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
            </div>
            <button className="h-10 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-[#4B341C] hover:text-white transition">Filter</button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f9fafb] text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Bill no</th>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-4 py-3">Phone No</th>
                    <th className="px-4 py-3">Date Time</th>
                    <th className="px-4 py-3">Total Products</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Paid Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                      <td className="px-4 py-3 font-medium text-gray-800">{o.id}</td>
                      <td className="px-4 py-3 text-gray-800">{o.customer}</td>
                      <td className="px-4 py-3 text-gray-600">{o.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{o.date}</td>
                      <td className="px-4 py-3 text-gray-800">{o.products}</td>
                      <td className="px-4 py-3 text-gray-800">₦{o.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            o.status === 'Paid'
                              ? 'bg-[#E6F7EF] text-[#0F9D58] border border-[#BFE9D6]'
                              : 'bg-[#FDEDEE] text-[#D93025] border border-[#F7C2C6]'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <div className="flex items-center gap-3">
                          <button className="px-2 py-1 rounded hover:bg-gray-100">Edit</button>
                          <button className="px-2 py-1 rounded hover:bg-gray-100">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}