import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/adminDashboard/Sidebar';
import AdminNavbar from '../components/adminDashboard/Navbar';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <AdminSidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40">
          <AdminNavbar />
        </div>
        <main className="flex-1 pt-16 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
