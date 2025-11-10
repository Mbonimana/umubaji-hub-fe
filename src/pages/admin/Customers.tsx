import { useState, useEffect } from 'react';
import { getBaseUrl } from '../../config/baseUrl';

interface Customer {
  name: string;
  email: string;
  phone: string;
  orders: number;
  joined: string;
}

export default function AdminCustomers() {
  const [selected, setSelected] = useState<null | Customer>(null);
  const [show, setShow] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${getBaseUrl()}/users/allcustomers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        const mappedCustomers: Customer[] = data.users.map((u: any) => ({
          name: `${u.firstname} ${u.lastname}`,
          email: u.email,
          phone: u.phone,
          orders: 0,
          joined: new Date().toISOString(),
        }));

        setCustomers(mappedCustomers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    [c.name, c.email, c.phone].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const highlightText = (text: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-secondary">{part}</span> : part
    );
  };

  return (
    <div className="space-y-4 relative">
      {/* Search input */}
      <div className="flex items-center justify-between mt-5">
        <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search customers"
            className="border rounded-md px-3 py-2 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <button
  className="px-3 py-2 bg-primary w-24 h-8 flex items-center justify-center text-white rounded-md hover:bg-primary-dark transition"
  onClick={() => { setSearch(''); setCurrentPage(1); }}
>
  Clear
</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
        <div className="px-4 py-3 border-b text-sm text-gray-700">Customer List</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Orders</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-center items-center py-6">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-[#4B341C] rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500 text-sm">Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">No customers found.</td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c.email} className="text-gray-700">
                    <td className="px-4 py-3">{highlightText(c.name)}</td>
                    <td className="px-4 py-3">{highlightText(c.email)}</td>
                    <td className="px-4 py-3">{highlightText(c.phone)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 p-4">
          <button
            className="px-3 py-1 rounded border text-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="px-3 py-1 rounded border text-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
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
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{selected.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Orders</span><span>{selected.orders}</span></div>
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
