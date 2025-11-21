import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag,  Settings, LogOut } from 'lucide-react';

export default function CustomerSidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-[#4B341C] text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <aside className="h-full bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#4B341C] text-white w-9 h-9 rounded-md flex items-center justify-center font-bold">UH</div>
          <div className="text-[#4B341C] font-semibold">Customer</div>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/home" className={linkClass} end>
          <Home size={18} /> Home
        </NavLink>
        <NavLink to="/customer/orders" className={linkClass}>
          <ShoppingBag size={18} /> My Orders
        </NavLink>
       
        {/* <NavLink to="/customer/messages" className={linkClass}>
          <MessageSquare size={18} /> Messages
        </NavLink> */}
        <NavLink to="/customer/settings" className={linkClass}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>

      <div className="mt-6 pt-4 border-t">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 mb-0">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
