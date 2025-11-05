import { Bell, Search, ChevronDown } from 'lucide-react';

export default function AdminNavbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-medium text-gray-800">Admin Dashboard</h1>
        <span className="hidden md:inline text-sm text-gray-500">Monitor your platform performance and activity</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-600">
          <Search className="w-4 h-4 text-gray-400" />
          <input className="outline-none" placeholder="Search..." />
        </div>
        <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">3</span>
        </button>
        <button className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">AD</div>
          <span className="hidden md:inline text-sm text-gray-700">Admin</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
