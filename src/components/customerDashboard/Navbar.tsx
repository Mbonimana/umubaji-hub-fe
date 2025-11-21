
import { Bell } from 'lucide-react';

export default function CustomerTopbar() {


  return (
    <div className="h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[#4B341C]">Customer Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        
        <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mr-20">
          <Bell size={18} className="text-gray-600 mr" />
        </button>
       
      </div>
    </div>
  );
}
