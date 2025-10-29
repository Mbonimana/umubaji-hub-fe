
// Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-md hover:scale-105">
                <span className="text-white font-bold text-lg">UH</span>
              </div>
              <span className="font-semibold text-lg text-gray-800">ububajiHub</span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden sm:flex space-x-6 font-medium text-gray-600">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/explore" className="hover:text-primary">Explore</Link></li>
              <li><Link to="/vendorPage" className="hover:text-primary">Vendors</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
            </ul>

            {/* Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium">
                Login
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-md text-sm font-medium">
                Register
              </button>
              <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-primary cursor-pointer" />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200 shadow-md">
            <ul className="flex flex-col space-y-2 p-4 text-gray-700">
              <li><Link to="/" className="block hover:text-primary">Home</Link></li>
              <li><Link to="/explore" className="block hover:text-primary">Explore</Link></li>
              <li><Link to="/vendorPage" className="block hover:text-primary">Vendors</Link></li>
              <li><Link to="/about" className="block hover:text-primary">About</Link></li>
              <li>
                <button className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm">
                  Login
                </button>
              </li>
              <li>
                <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  Register
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
