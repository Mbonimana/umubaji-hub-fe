// src/components/vendorDashboard/Sidebar.tsx
import { Home, Package, ShoppingCart,  Star,  Wallet, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
const menu = [
  { icon: Home, label: 'Dashboard', path: '/vendordashboard' },
  { icon: Package, label: 'My Products', path: '/my-products' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Star, label: 'Reviews', path: '/reviews' },
 

  { icon: Wallet, label: 'Earnings', path: '/earnings' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const [Vendorname, setVendorName] = useState('');
  const [VendorEmail, setVendorEmail] = useState('');
  const [CompanyName, setCompanyName] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('jwtToken');
    if(!token)
      return;{
      
      try{
        const decoded: any = jwtDecode(token);
        setVendorName(`${decoded.firstname} ${decoded.lastname}`);
        setVendorEmail( decoded.email);
        setCompanyName(decoded.company_name);
      } 
      catch(err){
        console.error("INVALID JWTOKEN");  

      }
    }
  },[]);
  
    // const token = getlocatItem()
  

  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between border-r border-gray-200">
      {/* Top: Vendor Profile */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-primary">{CompanyName}</h2>
      </div>

      {/* Middle: Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menu.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-[#4B341C] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom: User Profile */}
      <div className="p-4 border-t border-gray-200">
        {(() => {
          const storedId = localStorage.getItem('vendorId') || sessionStorage.getItem('vendorId') || '';
          const qs = storedId ? `?vendorId=${storedId}` : '';
          return (
            <Link to={`/profile${qs}`} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                   {Vendorname .split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-[#4B341C]">{Vendorname}</p>
                <p className="text-xs text-gray-500 group-hover:text-[#4B341C] ">{VendorEmail}</p>
              </div>
            </Link>
          );
        })()}
      </div>
    </aside>
  );
}