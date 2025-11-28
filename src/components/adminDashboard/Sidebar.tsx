import { NavLink } from 'react-router-dom';
import { Home, Users, Package, ShoppingCart, Settings, LogOut, Wallet } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const items = [
  { to: '/admin', label: 'Overview', icon: Home, end: true },
  { to: '/admin/vendors', label: 'Vendors', icon: Users },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
   { to: '/admin/payouts', label: 'Payouts', icon: Wallet },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
 
  

];

export default function AdminSidebar() {
  
  const [adminName, setAdminName] = useState('');
  const [adminEmail,setAdminEmail] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('jwtToken');
    if(!token) return;
    try{
      const decoded: any = jwtDecode(token);
      setAdminName(`${decoded.firstname} ${decoded.lastname}`);
      setAdminEmail(decoded.email);

    }
    catch(err){
      console.error('Invalid JWT');

    }
  }, []);

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
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
             {adminName .split(' ').map((n) => n[0]).join('')}</div>
          <div>
           
            <p className="text-sm font-medium text-gray-800">{adminName}</p>
            <p className="text-xs text-gray-500">{adminEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
