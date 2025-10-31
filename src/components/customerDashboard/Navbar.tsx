import { useEffect, useState } from 'react';
import { Search, Bell } from 'lucide-react';

export default function CustomerTopbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <div className="h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[#4B341C]">Customer Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 h-10">
          <Search size={16} className="text-gray-500" />
          <input
            placeholder="Search orders, items..."
            className="ml-2 bg-transparent outline-none text-sm text-gray-700"
          />
        </div>
        <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
          <Bell size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#4B341C] text-white flex items-center justify-center">
            {(user?.firstname?.[0] || 'U').toUpperCase()}
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">{user?.firstname ? `${user.firstname} ${user?.lastname ?? ''}` : 'User'}</div>
            <div className="text-gray-500 text-xs">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
