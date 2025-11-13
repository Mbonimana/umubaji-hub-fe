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

  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-lg font-semibold text-primary">Vendor Dashboard</h1>
          <p className="text-sm text-[#5A4632]-700">Monitor your shop performance and activities</p>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3 space-x-5">
          <div className='bg-[#F5F5F5] rounded-full transition'>
          <button className="p-2   ">
            <Bell className="w-6 h-6   " />
          </button>
          </div>
         
          <button onClick={handleLogout} className="group flex items-center gap-2 px-3 py-2  hover:bg-gray-100 hover:text-black transition" title="Logout">
            <LogOut className="w-5 h-5 text-[#333333] group-hover:text-black " />
            <span className="text-sm font-medium text-[#333333] group-hover:text-black">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}