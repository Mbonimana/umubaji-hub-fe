import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Heart,
} from "lucide-react";

import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext"; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { wishlist } = useWishlist(); // ✅ NEW

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length; // ✅ NEW

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleUserUpdate = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) setUser(JSON.parse(updatedUser));
      else setUser(null);
    };

    window.addEventListener("userLoggedIn", handleUserUpdate);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwtToken", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Logged in user:", payload.email, payload.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userLoggedIn"));
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-[4%]">
          <div className="flex justify-between h-16 items-center">

            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Link to="/home">
                <div className="logo bg-primary w-10 h-10 rounded-md flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold">UH</span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <ul className="hidden sm:flex space-x-5 ml-6 text-[15px] font-medium text-gray-700">
                {["Home", "Explore", "Vendors", "AboutUs"].map((item) => {
                  const paths: Record<string, string> = {
                    Home: "/home",
                    Explore: "/explore",
                    Vendors: "/allvendors",
                    AboutUs: "/about-us",
                  };

                  return (
                    <li key={item}>
                      <Link
                        to={paths[item]}
                        className="relative hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-primary after:bottom-[-3px] after:left-0 hover:after:w-full after:transition-all after:duration-300"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
              {user ? (
                <div className="flex items-center gap-6 text-sm text-slate-700">
                  <span className="hidden sm:inline font-medium text-primary">
                    Hi, <span className="capitalize">{user.firstname}</span>
                  </span>

                  <Link
                    to="/customer-dashboard"
                    className="hidden sm:inline-block font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    Dashboard
                  </Link>

                  {/* ❤️ Wishlist */}
                  <Link to="/wishlist" className="relative group" title="My Wishlist">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-primary transition duration-200 group-hover:scale-110" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* 🛒 Cart */}
                  <Link to="/cart" className="relative group" title="View Cart">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-primary transition duration-200 group-hover:scale-110" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex items-center justify-center h-8 px-4 rounded-md border border-slate-300 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-black transition duration-200"
                    title="Logout"
                  >
                    <LogOut size={18} className="mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  {/* ❤️ Wishlist for guests too */}
                  <Link to="/wishlist" className="relative group" title="My Wishlist">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-primary transition duration-200 group-hover:scale-110" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link to="/cart" className="relative group" title="View Cart">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-primary transition duration-200 group-hover:scale-110" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Login */}
                  <Link to="/Login">
                    <button className="hidden sm:inline-flex items-center justify-center h-8 w-20 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                      Login
                    </button>
                  </Link>
                </>
              )}

              {/* ☰ Hamburger Menu */}
              <button
                className="sm:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* 📱 Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden bg-white border-t border-slate-200 animate-slideDown shadow-md">
            <ul className="flex flex-col space-y-3 p-4 text-gray-700 text-sm font-medium">
              {["Home", "Explore", "Vendors", "About"].map((item) => {
                const paths: Record<string, string> = {
                  Home: "/",
                  Explore: "/explore",
                  Vendors: "/allvendors",
                  About: "/about-us",
                };

                return (
                  <li key={item}>
                    <Link
                      to={paths[item]}
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-2 px-3 rounded-md hover:bg-slate-100 hover:text-primary transition"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}

              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 hover:text-primary transition"
                >
                  <Heart size={16} className="text-primary" />
                  Wishlist
                </Link>
              </li>

              {!user ? (
                <li>
                  <Link to="/Login" onClick={() => setIsOpen(false)}>
                    <button className="w-full h-10 rounded-md border border-slate-300 bg-slate-50 text-sm font-medium hover:bg-slate-100 transition">
                      Login
                    </button>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/customer-dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block w-full h-10 rounded-md bg-gray-50 text-slate-700 text-center font-medium hover:bg-primary hover:text-white transition"
                    >
                      Go to Dashboard
                    </Link>
                  </li>

                  <li className="flex space-x-2">
                    <div className="w-1/2 flex items-center justify-center h-10 rounded-md bg-gray-50 text-slate-700 font-medium">
                      Hi, {user.firstname}
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-1/2 flex items-center justify-center gap-1 h-10 rounded-md bg-slate-50 text-slate-700 hover:bg-black hover:text-white transition font-medium"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

export default Navbar;