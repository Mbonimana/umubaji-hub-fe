import { useEffect, useState } from 'react';
import CustomerSidebar from '../../components/customerDashboard/Sidebar';
import CustomerTopbar from '../../components/customerDashboard/Navbar';

interface CustomerProfile {
  id?: string | number;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  status?: 'Active' | 'Inactive';
  joined?: string;
}

export default function CustomerSettings() {
  const [profile, setProfile] = useState<CustomerProfile>({ status: 'Active' });
  const [, setOriginal] = useState<CustomerProfile>({});
  const [tab, setTab] = useState<'personal' | 'security'>('personal');

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        const withDefaults: CustomerProfile = {
          ...u,
          status: u.status ?? 'Active',
          joined: u.joined ?? new Date().toISOString().slice(0, 10),
        };
        setProfile(withDefaults);
        setOriginal(withDefaults);
      } catch {}
    }
  }, []);

  const onSave = () => {
    localStorage.setItem('user', JSON.stringify(profile));
    setOriginal(profile);
    window.dispatchEvent(new Event('userLoggedIn'));
    alert('Profile saved');
  };

  const initials = `${(profile.firstname?.[0] || 'U').toUpperCase()}${(profile.lastname?.[0] || '').toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <CustomerSidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <CustomerTopbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left summary card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">{initials}</div>
              <div className="mt-3 text-lg font-semibold text-gray-900">{[profile.firstname, profile.lastname].filter(Boolean).join(' ') || 'Customer'}</div>
              <div className="text-sm text-gray-500">Customer</div>
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">{profile.status}</span>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Email</span><span className="text-gray-800">{profile.email || '-'}</span></div>
                <div className="flex justify-between"><span>Phone</span><span className="text-gray-800">{profile.phone || '-'}</span></div>
                <div className="flex justify-between"><span>Joined</span><span className="text-gray-800">{profile.joined || '-'}</span></div>
              </div>
            </div>

            {/* Right content: tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-4 pt-4">
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 border border-gray-200 rounded-md p-1 w-full sm:w-1/2">
                    <button onClick={() => setTab('personal')} className={`h-9 rounded ${tab==='personal' ? 'bg-white border border-gray-200 text-[#4B341C]' : 'text-gray-700'}`}>Personal Information</button>
                    <button onClick={() => setTab('security')} className={`h-9 rounded ${tab==='security' ? 'bg-white border border-gray-200 text-[#4B341C]' : 'text-gray-700'}`}>Security</button>
                  </div>
                </div>

                {tab === 'personal' ? (
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">First Name</label>
                        <input value={profile.firstname || ''} onChange={(e) => setProfile({ ...profile, firstname: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                        <input value={profile.lastname || ''} onChange={(e) => setProfile({ ...profile, lastname: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                        <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Address</label>
                        <input value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Emergency Contact</label>
                        <input value={profile.emergencyName || ''} onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Emergency Phone</label>
                        <input value={profile.emergencyPhone || ''} onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button onClick={onSave} className="px-4 py-2 rounded-md bg-[#4B341C] text-white">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                        <input type="password" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">New Password</label>
                        <input type="password" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none" placeholder="••••••••" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                        <input type="password" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button className="px-4 py-2 rounded-md bg-[#4B341C] text-white">Update Password</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
