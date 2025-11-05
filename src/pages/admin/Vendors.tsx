import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdminVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState(
    [
      { name: 'Kigali Woodworks', email: 'contact@kigaliwood.rw', products: 42, status: 'Pending' },
      { name: 'Nyamirambo Crafts', email: 'hello@nyamirambo.rw', products: 18, status: 'Active' },
      { name: 'Bugesera Doors', email: 'sales@bugesera.rw', products: 27, status: 'Suspended' },
    ] as Array<{ name: string; email: string; products: number; status: string; reason?: string }>
  );
  const [selected, setSelected] = useState<null | { name: string; email: string; products: number; status: string; reason?: string }>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const badge = (s: string) =>
    s === 'Active'
      ? 'bg-green-50 text-green-700'
      : s === 'Pending'
      ? 'bg-yellow-50 text-yellow-700'
      : 'bg-red-50 text-red-700';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-5">
        <h2 className="text-lg font-semibold text-gray-800">Vendors</h2>
        <button onClick={() => navigate('/signup')} className="bg-[#4B341C] text-white px-4 py-2 rounded-lg text-sm ">Add Vendor</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-700">Vendor List</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Products</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendors.map((v) => (
                <tr key={v.email} className="text-gray-700">
                  <td className="px-4 py-3">{v.name}</td>
                  <td className="px-4 py-3">{v.email}</td>
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
        </div>
      </div>

      {showDetails && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowDetails(false); setSelected(null); }} />
          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Vendor Details</h3>
                <p className="text-sm text-gray-500">Review vendor before approval</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-md border text-gray-700"
                onClick={() => { setShowDetails(false); setSelected(null); }}
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span>{selected?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selected?.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Products</span><span>{selected?.products}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span>{selected?.status}</span></div>
              {selected?.reason && (
                <div className="flex justify-between"><span className="text-gray-500">Reason</span><span className="max-w-[60%] text-right">{selected?.reason}</span></div>
              )}
            </div>

            {!canManage ? (
              <div className="mt-6 flex items-center justify-end">
                <button
                  className="px-4 py-2 rounded-lg bg-[#4B341C] text-white"
                  onClick={() => setCanManage(true)}
                >
                  Manage
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="text-sm">
                  <label className="block text-gray-700 mb-1">Rejection reason (required only when rejecting)</label>
                  <textarea
                    className="w-full border rounded-lg p-2 h-24"
                    placeholder="Explain why this vendor is rejected..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="px-3 py-2 rounded-lg border text-gray-700"
                    onClick={() => { setCanManage(false); setReason(''); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
                    disabled={submitting}
                    onClick={async () => {
                      if (!selected) return;
                      setSubmitting(true);
                      setVendors((prev) => prev.map((x) => (x.email === selected.email ? { ...x, status: 'Active', reason: undefined } : x)));
                      setSubmitting(false);
                      setCanManage(false);
                      setShowDetails(false);
                      setSelected(null);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                    disabled={submitting || reason.trim().length === 0}
                    onClick={async () => {
                      if (!selected) return;
                      if (reason.trim().length === 0) return;
                      setSubmitting(true);
                      setVendors((prev) => prev.map((x) => (x.email === selected.email ? { ...x, status: 'Rejected', reason: reason.trim() } : x)));
                      setSubmitting(false);
                      setCanManage(false);
                      setShowDetails(false);
                      setSelected(null);
                      setReason('');
                    }}
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
