import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../config/baseUrl';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [selected, setSelected] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate('/');
  };

  // Fetch pending vendors
  const fetchPendingVendors = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/users/pending`);
      const vendors = res.data.users || [];
      setPendingVendors(vendors);
    } catch (err) {
      console.error('Failed to fetch pending vendors', err);
      setPendingVendors([]);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  // Approve Vendor
  const verifyVendor = async (id: number) => {
    setSubmitting(true);
    try {
      await axios.put(`${getBaseUrl()}/users/verify/${id}`);
      setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    } finally {
      setSubmitting(false);
      setShowDetails(false);
      setSelected(null);
      setCanManage(false);
      setReason('');
    }
  };

  // Reject Vendor
  const rejectVendor = async (id: number) => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await axios.put(`${getBaseUrl()}/users/reject/${id}`, { reason });
      setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    } finally {
      setSubmitting(false);
      setShowDetails(false);
      setSelected(null);
      setCanManage(false);
      setReason('');
    }
  };

  // Clear all notifications
  const clearNotifications = () => {
    setPendingVendors([]);
  };

  return (
    <div className="relative">
      {/* NAVBAR */}
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium text-gray-800">Admin Dashboard</h1>
          <span className="hidden md:inline text-sm text-gray-500">Monitor your platform performance and activity</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Bell */}
          <button
            className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {pendingVendors.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                {pendingVendors.length}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="text-black" />
            <span>Logout</span>
          </button>
        </div>
      </div>

     
      {showNotifications && pendingVendors.length > 0 && (
        <div className="absolute top-16 right-6 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="flex flex-col divide-y">
            {pendingVendors.map((v) => (
              <div key={v.id} className="px-4 py-3 hover:bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-700">
              <strong>{v.firstname} {v.lastname} </strong>   has requested to be a vendor.
                </div>
                <button
                  className="px-2 w-20 h-8 py-1 bg-[#4B341C] text-white text-xs rounded"
                  onClick={() => {
                    setSelected({
                      id: v.id,
                      vendor_name: v.firstname,
                      vendor_sname: v.lastname,
                      phone: v.phone,
                      location: v.company_location,
                      company_name: v.company_name,
                      email: v.email,
                      status: 'pending',
                      reason: '',
                      rdb_certificate: v.rdb_certificate,
                      national_id_file: v.national_id_file,
                      company_logo: v.company_logo,
                      company_cover_photo: v.company_cover_photo,
                    });
                    setShowDetails(true);
                    setCanManage(true);
                  }}
                >
                  Check
                </button>
              </div>
            ))}

            {/* CLEAR NOTIFICATIONS BUTTON */}
            <button
              className="w-full bg-gray-100 text-gray-700 text-sm py-2 hover:bg-gray-200"
              onClick={clearNotifications}
            >
              Clear Notifications
            </button>
          </div>
        </div>
      )}

      {/* Vendor Modal (same as before) */}
      {showDetails && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowDetails(false);
              setSelected(null);
              setCanManage(false);
              setReason('');
            }}
          />
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Vendor Details</h3>
              <button
                className="px-3 py-1.5 rounded-md border text-gray-700"
                onClick={() => {
                  setShowDetails(false);
                  setSelected(null);
                  setCanManage(false);
                  setReason('');
                }}
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Vendor Name</span>
                <span>{selected.vendor_name} {selected.vendor_sname}</span>
              </div>
              <div className="flex justify-between">
                <span>Company Name</span>
                <span>{selected.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone</span>
                <span>{selected.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span>{selected.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span>{selected.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span>{selected.status}</span>
              </div>

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
                {selected.rdb_certificate && <a href={selected.rdb_certificate} target="_blank" className="text-[#4B341C] underline block">View RDB Certificate</a>}
                {selected.national_id_file && <a href={selected.national_id_file} target="_blank" className="text-[#4B341C] underline block">View National ID</a>}
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
