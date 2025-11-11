import { useState, useEffect } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../config/baseUrl';

export default function AdminVendors() {

  const [vendors, setVendors] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Search State
  const [search, setSearch] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const badge = (s: string) =>
    s === 'verified'
      ? 'bg-green-50 text-green-700'
      : s === 'pending'
      ? 'bg-yellow-50 text-yellow-700'
      : 'bg-red-50 text-red-700';

  // 🔍 Highlight Function
  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text?.toString().replace(regex, "<mark>$1</mark>");
  };

  // Load Vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${getBaseUrl()}/users/allvendors`);
        const vendorsData = res.data.users.map((v: any) => ({
          id: v.id,
          vendor_name: v.firstname,
          vendor_sname: v.lastname,
          phone: v.phone,
          location: v.company_location,
          company_name: v.company_name,
          email: v.email,
          products: 0,
          status: v.verified,
          reason: v.reason ?? undefined,
          rdb_certificate: v.rdb_certificate,
          national_id_file: v.national_id_file,
          company_logo: v.company_logo,
          company_cover_photo: v.company_cover_photo
        }));
        setVendors(vendorsData);
        setFiltered(vendorsData);
      } catch (err) {
        console.error('Failed to load vendors:', err);
        setVendors([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Apply Filter + Search
  const applyFilter = (status: 'all' | 'pending' | 'verified' | 'rejected') => {
    setFilter(status);
    setCurrentPage(1);

    let base = vendors;
    if (status !== 'all') {
      base = base.filter((v) => v.status === status);
    }

    const searched = base.filter((v) =>
      [v.vendor_name, v.vendor_sname, v.company_name, v.email, v.phone]
        .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
    );

    setFiltered(searched);
  };

  // Reapply search on typing
  useEffect(() => {
    applyFilter(filter);
  }, [search]);

  // Verify Vendor
  const verifyVendor = async (id: number) => {
    setSubmitting(true);
    try {
      await axios.put(`${getBaseUrl()}/users/verify/${id}`);
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: 'verified', reason: undefined } : v))
      );
      applyFilter(filter);
    } finally {
      setSubmitting(false);
      setShowDetails(false);
      setSelected(null);
      setCanManage(false);
    }
  };

  // Reject Vendor
  const rejectVendor = async (id: number) => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await axios.put(`${getBaseUrl()}/users/reject/${id}`, { reason });
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: 'rejected', reason } : v))
      );
      applyFilter(filter);
    } finally {
      setSubmitting(false);
      setShowDetails(false);
      setSelected(null);
      setReason('');
      setCanManage(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedVendors = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-5">
        <h2 className="text-lg font-semibold text-gray-800">Vendors</h2>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search vendors"
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

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-3 text-sm">
        {['all', 'pending', 'verified', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => applyFilter(s as any)}
            className={`px-3 py-1.5 rounded-md border ${
              filter === s ? 'bg-[#4B341C] text-white border-[#4B341C]' : 'text-gray-700'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-700">Vendor List</div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-[#4B341C] rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-500 text-sm">Loading vendors...</span>
            </div>
          ) : paginatedVendors.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No vendors found.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Company Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Vendor Name</th>
                  <th className="text-left px-4 py-3">Products</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedVendors.map((v) => (
                  <tr key={v.id} className="text-gray-700">
                    <td
                      className="px-4 py-3"
                      dangerouslySetInnerHTML={{ __html: highlight(v.company_name, search) }}
                    />
                    <td
                      className="px-4 py-3"
                      dangerouslySetInnerHTML={{ __html: highlight(v.email, search) }}
                    />
                    <td
                      className="px-4 py-3"
                      dangerouslySetInnerHTML={{ __html: highlight(`${v.vendor_name} ${v.vendor_sname}`, search) }}
                    />
                    <td className="px-4 py-3">{v.products}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs ${badge(v.status)}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="px-3 py-1.5 rounded-md border text-gray-700"
                          onClick={() => {
                            setSelected(v);
                            setShowDetails(true);
                            setCanManage(false);
                            setReason('');
                          }}
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-md bg-[#4B341C] text-white"
                          onClick={() => {
                            setSelected(v);
                            setShowDetails(true);
                            setCanManage(true);
                            setReason('');
                          }}
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

      {showDetails && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowDetails(false); setSelected(null); }} />
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Vendor Details</h3>
              <button
                className="px-3 py-1.5 rounded-md border text-gray-700"
                onClick={() => { setShowDetails(false); setSelected(null); }}
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between"><span>Vendor Name</span><span>{selected.vendor_name} {selected.vendor_sname}</span></div>
              <div className="flex justify-between"><span>Company Name</span><span>{selected.company_name}</span></div>
              <div className="flex justify-between"><span>Phone</span><span>{selected.phone}</span></div>
              <div className="flex justify-between"><span>Email</span><span>{selected.email}</span></div>
              <div className="flex justify-between"><span>Location</span><span>{selected.location}</span></div>
              <div className="flex justify-between"><span>Status</span><span>{selected.status}</span></div>

              {selected.company_logo && (
                <div>
                  <p className="text-gray-500 mb-1">Company Logo</p>
                  <img src={selected.company_logo} className="w-24 h-24 object-cover border rounded" />
                </div>
              )}

              {selected.company_cover_photo && (
                <div>
                  <p className="text-gray-500 mb-1">Cover Photo</p>
                  <img src={selected.company_cover_photo} className="w-full max-h-40 object-cover border rounded" />
                </div>
              )}

              <div className="space-y-1">
                <p className="text-gray-500">Documents:</p>

                {selected.rdb_certificate && (
                  <a href={selected.rdb_certificate} target="_blank" className="text-[#4B341C] underline block">View RDB Certificate</a>
                )}

                {selected.national_id_file && (
                  <a href={selected.national_id_file} target="_blank" className="text-[#4B341C] underline block">View National ID</a>
                )}
              </div>
            </div>

            {canManage && (
              <div className="mt-6 space-y-4">
                <textarea
                  className="w-full border rounded-lg p-2 h-24"
                  placeholder="Explain why this vendor is rejected..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <div className="flex items-center justify-end gap-2">
                  <button className="px-3 py-2 rounded-lg border text-gray-700" onClick={() => setCanManage(false)}>
                    Cancel
                  </button>

                  <button
                    className="px-3 py-2 rounded-lg bg-green-600 text-white"
                    disabled={submitting}
                    onClick={() => verifyVendor(selected.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                    disabled={submitting || reason.trim().length === 0}
                    onClick={() => rejectVendor(selected.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
