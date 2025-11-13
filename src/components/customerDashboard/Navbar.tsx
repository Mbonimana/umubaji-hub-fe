import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';


export default function CustomerTopbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);


const [CustomerName, setCustomerName] = useState('');
const [customerEmail, setCustomerEmail] = useState('');


useEffect(()=>{
  const token = localStorage.getItem("jwtToken");
  if(!token) return;{
    try{
      const decoded: any = jwtDecode(token);
      setCustomerName(`${decoded.firstname} ${decoded.lastname}`);
      setCustomerEmail(decoded.email)

    }
    catch(err){
      console.error("Invalid JWToken");
    }
  }

},[]);

  return (
    <div className="h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[#4B341C]">Customer Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        
        <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
          <Bell size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#4B341C] text-white flex items-center justify-center">
            {(user?.firstname?.[0] || 'U').toUpperCase()}
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">{CustomerName}</div>
            <div className="text-gray-500 text-xs">{customerEmail}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
