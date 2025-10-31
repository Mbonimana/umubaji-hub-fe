import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../config/baseUrl';

export default function Settings() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [originalCompanyName, setOriginalCompanyName] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseURL = useMemo(() => getBaseUrl(), []);

  const [vendorId, setVendorId] = useState<number | undefined>(() => {
    const qs = new URLSearchParams(window.location.search).get('vendorId');
    const stored = localStorage.getItem('vendorId') || sessionStorage.getItem('vendorId');
    const v = qs ?? stored ?? '';
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  });

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search).get('vendorId');
    if (qs && !localStorage.getItem('vendorId')) {
      const n = Number(qs);
      if (Number.isFinite(n) && n > 0) {
        localStorage.setItem('vendorId', String(n));
        setVendorId(n);
      }
    }

    if (!vendorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`${baseURL}/vendors/${vendorId}`)
      .then((r) => {
        const v = r.data || {};
        const c = v.company_name || '';
        const e = v.email || '';
        const p = v.phone || '';
        setCompanyName(c);
        setEmail(e);
        setPhone(p);
        setOriginalCompanyName(c);
        setOriginalEmail(e);
        setOriginalPhone(p);
        setEditMode(false);
      })
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load vendor profile'))
      .finally(() => setLoading(false));
  }, [baseURL, vendorId]);

  const onSave = async () => {
    // Placeholder: wire to API later
    // eslint-disable-next-line no-alert
    try {
      if (!vendorId) return;
      setError(null);
      await axios.put(`${baseURL}/vendors/${vendorId}`, {
        company_name: companyName,
        email,
        phone,
      });
      setOriginalCompanyName(companyName);
      setOriginalEmail(email);
      setOriginalPhone(phone);
      setEditMode(false);
      alert('Settings saved (placeholder).');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save settings');
    }
  };
  const onCancel = () => {
    setCompanyName(originalCompanyName);
    setEmail(originalEmail);
    setPhone(originalPhone);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Vendor Profile</h1>

          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : !vendorId ? (
            <div className="text-gray-500 text-sm">No vendor context.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">{(companyName?.[0] || 'V').toUpperCase()}</div>
                <div className="mt-3 text-lg font-semibold text-gray-900">{companyName || 'Vendor'}</div>
                <div className="text-sm text-gray-500">Business</div>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Email</span><span className="text-gray-800">{email || '-'}</span></div>
                  <div className="flex justify-between"><span>Phone</span><span className="text-gray-800">{phone || '-'}</span></div>
                  <div className="flex justify-between"><span>ID</span><span className="text-gray-800">{vendorId}</span></div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                  {!editMode ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="text-base text-gray-900">{companyName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-base text-gray-900">{email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-base text-gray-900">{phone || '-'}</p>
                      </div>
                      <div className="pt-2">
                        <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded-md bg-[#4B341C] text-white">Edit Profile</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="Your company name" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Email</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="you@example.com" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Phone</label>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="+250 7xx xxx xxx" />
                        </div>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button onClick={onSave} className="px-4 py-2 rounded-md bg-[#4B341C] text-white">Save Changes</button>
                        <button onClick={onCancel} className="px-4 py-2 rounded-md border border-gray-300">Cancel</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
