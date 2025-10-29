// src/components/vendor/Sidebar.tsx
import { Home, Package, ShoppingCart, BarChart3, Star, MessageCircle, DollarSign, Settings } from 'lucide-react';

const menu = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Package, label: 'My Products', badge: 5 },
  { icon: ShoppingCart, label: 'Orders', badge: 2 },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Star, label: 'Reviews' },
  { icon: MessageCircle, label: 'Messages', badge: 3 },
  { icon: DollarSign, label: 'Income' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between border-r border-gray-200">
      {/* Top: Vendor Profile */}
      <div>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
              MC
            </div>
            <div>
              <p className="font-semibold text-[#5A4632]-900">Master Crafts</p>
              <p className="text-xs text-[#5A4632]-700">Vendor Account</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menu.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                item.active
                  ? 'bg-amber-100 text-amber-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                    item.badge === 5
                      ? 'bg-amber-500 text-white'
                      : item.badge === 2
                      ? 'bg-orange-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Vendor Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
          <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            MC
          </div>
          <div>
            <p className="font-medium text-amber-900">Master Crafts</p>
            <p className="text-xs text-amber-700">vendor@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}