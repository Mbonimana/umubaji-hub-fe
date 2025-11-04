// src/components/vendorDashboard/Navbar.tsx
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLoggedIn'));
    navigate('/');
  };
  const goProfile = () => {
    const storedId = localStorage.getItem('vendorId') || sessionStorage.getItem('vendorId') || '';
    const qs = storedId ? `?vendorId=${storedId}` : '';
    navigate(`/profile${qs}`);
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-lg font-semibold text-[#5A4632]-900">Vendor Dashboard</h1>
          <p className="text-sm text-[#5A4632]-700">Monitor your shop performance and activities</p>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3">
          <div className='bg-[#F5F5F5] rounded-lg hover:bg-amber-100 transition'>
          <button className="p-2 hover:bg-amber-100 rounded-lg transition hover:bg-[#4B341C] ">
            <Bell className="w-5 h-5 text-[#333333] hover:text-white " />
          </button>
          </div>
          <button onClick={goProfile} className="group flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] rounded-lg hover:bg-[#4B341C] hover:text-white transition" title="View Profile">
            <div className="w-6 h-6 bg-[#4B341C] rounded-full flex items-center justify-center text-white text-xs font-bold">
              MC
            </div>
            <span className="text-sm font-medium text-[#333333] group-hover:text-white">Vendor</span>
            <svg className="w-4 h-4 text-[#4B341C] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" className='text-[#333333] group-hover:text-white' />
            </svg>
          </button>
          <button onClick={handleLogout} className="group flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] hover:bg-[#4B341C] hover:text-white transition" title="Logout">
            <LogOut className="w-5 h-5 text-[#333333] group-hover:text-white" />
            <span className="text-sm font-medium text-[#333333] group-hover:text-white">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}