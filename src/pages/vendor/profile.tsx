import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../config/baseUrl';

export default function Profile() {
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyCoverImage, setCompanyCoverImage] = useState<File | null>(null);

  const [originalCompanyName, setOriginalCompanyName] = useState('');
  const [originalCompanyLocation, setOriginalCompanyLocation] = useState('');
  const [originalCompanyPhone, setOriginalCompanyPhone] = useState('');
  const [originalCompanyDescription, setOriginalCompanyDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
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
        const name = v.company_name || '';
        const loc = v.company_location || '';
        const ph = v.company_phone || '';
        const desc = v.company_description || '';
        setCompanyName(name);
        setCompanyLocation(loc);
        setCompanyPhone(ph);
        setCompanyDescription(desc);
        setOriginalCompanyName(name);
        setOriginalCompanyLocation(loc);
        setOriginalCompanyPhone(ph);
        setOriginalCompanyDescription(desc);
        setEditMode(false);
      })
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load vendor profile'))
      .finally(() => setLoading(false));
  }, [baseURL, vendorId]);

  const onSave = async () => {
    try {
      if (!vendorId) return;
      setError(null);
      const form = new FormData();
      form.append('company_name', companyName);
      form.append('company_location', companyLocation);
      form.append('company_phone', companyPhone);
      form.append('company_description', companyDescription);
      if (companyLogo) form.append('company_logo', companyLogo);
      if (companyCoverImage) form.append('company_coverimage', companyCoverImage);
      await axios.put(`${baseURL}/vendors/${vendorId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setOriginalCompanyName(companyName);
      setOriginalCompanyLocation(companyLocation);
      setOriginalCompanyPhone(companyPhone);
      setOriginalCompanyDescription(companyDescription);
      setEditMode(false);
      alert('Profile saved.');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save profile');
    }
  };

  const onCancel = () => {
    setCompanyName(originalCompanyName);
    setCompanyLocation(originalCompanyLocation);
    setCompanyPhone(originalCompanyPhone);
    setCompanyDescription(originalCompanyDescription);
    setCompanyLogo(null);
    setCompanyCoverImage(null);
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
                        <p className="text-sm text-gray-600">Company Location</p>
                        <p className="text-base text-gray-900">{companyLocation || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Phone</p>
                        <p className="text-base text-gray-900">{companyPhone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Description</p>
                        <p className="text-base text-gray-900 whitespace-pre-wrap">{companyDescription || '-'}</p>
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
                          <label className="block text-sm text-gray-600 mb-1">Company Location</label>
                          <input value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="Kigali, Rwanda" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Company Phone</label>
                          <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="Company contact phone" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Company Description</label>
                          <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="w-full min-h-[96px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="Describe your company" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Company Logo</label>
                          <input type="file" accept="image/*" onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)} className="block w-full text-sm" />
                          {companyLogo && (
                            <div className="mt-2">
                              <img src={URL.createObjectURL(companyLogo)} alt="Logo preview" className="w-24 h-24 rounded-md object-cover border" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Company Cover Image</label>
                          <input type="file" accept="image/*" onChange={(e) => setCompanyCoverImage(e.target.files?.[0] || null)} className="block w-full text-sm" />
                          {companyCoverImage && (
                            <div className="mt-2">
                              <img src={URL.createObjectURL(companyCoverImage)} alt="Cover preview" className="w-full max-w-sm h-32 rounded-md object-cover border" />
                            </div>
                          )}
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
