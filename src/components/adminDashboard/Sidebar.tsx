import { NavLink } from 'react-router-dom';
import { Home, Users, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const items = [
  { to: '/admin', label: 'Overview', icon: Home, end: true },
  { to: '/admin/vendors', label: 'Vendors', icon: Users },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate('/');
  };

  // Reusable link/button style
  const linkClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100';

  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between border-r border-gray-200">
      <div>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">UbubajiHub</h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>

        <nav className="py-3 px-2 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end as any}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#4B341C] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Logout button styled like nav links */}
          <button
            onClick={handleLogout}
            className={`${linkClasses} w-full text-left`}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">AD</div>
          <div>
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@ububaji.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
