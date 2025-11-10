import { Bell,LogOut  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLoggedOut'));
      navigate('/');
    };
  
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-medium text-gray-800">Admin Dashboard</h1>
        <span className="hidden md:inline text-sm text-gray-500">Monitor your platform performance and activity</span>
      </div>
      <div className="flex items-center gap-4">
       
        <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">3</span>
        </button>

         <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 "  >
                    <LogOut className="text-black" />
                    <span>Logout</span>
                  </button>
       
      </div>
    </div>
  );
}
