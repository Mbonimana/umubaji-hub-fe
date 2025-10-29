import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart(); 
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full shadow-md bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo + Links */}
            <div className="flex items-center space-x-3">
              <div className="logo bg-primary w-10 h-10 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">UH</span>
              </div>
              <span className="font-semibold text-sm sm:text-lg">ububajiHub</span>

              <ul className="hidden sm:flex space-x-4 ml-6">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/" className="hover:text-primary">Explore</Link></li>
                <li><Link to="/" className="hover:text-primary">Vendors</Link></li>
                <li><Link to="/" className="hover:text-primary">About</Link></li>
              </ul>
            </div>

            {/* Cart + Auth + Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">

              
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button className="hidden sm:inline-block h-8 w-20 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100">Login</button>
              <button className="hidden sm:inline-block h-8 w-20 bg-primary text-white rounded-md hover:bg-primary/90">Register</button>

              <button
                className="sm:hidden p-2 rounded-md focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

       
        {isOpen && (
          <div className="sm:hidden bg-white border-t border-slate-200">
            <ul className="flex flex-col space-y-2 p-4">
              <li><Link to="/" className="block w-full">Home</Link></li>
              <li><Link to="/" className="block w-full">Explore</Link></li>
              <li><Link to="/" className="block w-full">Vendors</Link></li>
              <li><Link to="/" className="block w-full">About</Link></li>
              <li>
                <button className="w-full h-8 mb-2 rounded-md border border-slate-300 bg-slate-50">Login</button>
              </li>
              <li>
                <button className="w-full h-8 rounded-md bg-primary text-white">Register</button>
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