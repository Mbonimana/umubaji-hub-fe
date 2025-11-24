import { useEffect, useState } from 'react';
import CustomerSidebar from '../../components/customerDashboard/Sidebar';
import CustomerTopbar from '../../components/customerDashboard/Navbar';
import { jwtDecode } from 'jwt-decode';
import { getBaseUrl } from '../../config/baseUrl';
import Notiflix from 'notiflix';
import { useNavigate } from 'react-router-dom';

interface CustomerProfile {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  joined?: string;
}

export default function CustomerSettings() {
  const [profile, setProfile] = useState<CustomerProfile>({ status: 'Active' });
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Load user from JWT
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
        setProfile({
          ...profile,
          firstname: decoded.firstname,
          lastname: decoded.lastname,
          email: decoded.email,
          phone: decoded.phone,
          status: decoded.status || 'Active',
          joined: decoded.joined || new Date().toISOString().slice(0, 10),
        });
      } catch (err) {
        console.error('Failed to decode JWT:', err);
      }
    }
  }, []);

  // Update user on backend
  const updateProfile = async () => {
    if (!userId) return Notiflix.Notify.failure('User ID not found');

    // Validate required fields
    if (!profile.firstname || !profile.lastname || !profile.email || !profile.phone) {
      return Notiflix.Notify.warning('Please fill all required fields');
    }

    try {
      const res = await fetch(`${getBaseUrl()}/users/updateuser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
          phone: profile.phone,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        Notiflix.Notify.success('Profile updated successfully! You will be logged out.');

        // Clear localStorage and logout
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');

        // Redirect to login page after short delay to show notification
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        console.error(data);
        Notiflix.Notify.failure(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      Notiflix.Notify.failure('An error occurred while updating profile.');
    }
  };

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
            {/* Left summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
                {(profile.firstname?.[0] || 'U').toUpperCase()}
                {(profile.lastname?.[0] || '').toUpperCase()}
              </div>
              <div className="mt-3 text-lg font-semibold text-gray-900">
                {[profile.firstname, profile.lastname].filter(Boolean).join(' ') || 'Customer'}
              </div>
              <div className="text-sm text-gray-500">Customer</div>
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                {profile.status}
              </span>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="text-gray-800">{profile.email || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone</span>
                  <span className="text-gray-800">{profile.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Joined</span>
                  <span className="text-gray-800">{profile.joined || '-'}</span>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name</label>
                    <input
                      value={profile.firstname || ''}
                      onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                    <input
                      value={profile.lastname || ''}
                      onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      disabled

                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C] cursor-not-allowed bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                    <input
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={updateProfile}
                    className="px-4 py-2 rounded-md bg-[#4B341C] text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
