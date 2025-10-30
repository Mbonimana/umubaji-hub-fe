import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useCart } from "../../contexts/CartContext"; // added cart context

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { cartItems } = useCart(); // cart context
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0); // total items

  useEffect(() => {
    // Load user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Listen for login/logout in the same tab
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

    // Notify Navbar
    window.dispatchEvent(new Event("userLoggedIn"));

    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm z-50 transition-all duration-300">

        {/* Equal padding on left & right */}
        <div className="max-w-7xl mx-auto px-[4%] sm:px-[4%] lg:px-[4%]">
          <div className="flex justify-between h-16 items-center">

            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="logo bg-primary w-10 h-10 rounded-md flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">UH</span>
              </div>

              <span className="font-semibold text-sm sm:text-lg text-slate-800 tracking-wide">
                ububajiHub
              </span>

              {/* Desktop Menu */}
              <div className="flex-1 flex justify-center">
                <ul className="hidden sm:flex space-x-5 ml-6 text-[15px] font-medium text-gray-700">
                  {["Home", "Explore", "Vendors", "About"].map((item) => (
                    <li key={item}>
                      <Link
                        to="/"
                        className="relative hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-primary after:bottom-[-3px] after:left-0 hover:after:w-full after:transition-all after:duration-300"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 cursor-pointer hover:text-primary transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <span className="hidden sm:inline">Hi, {user.firstname}</span>

                  {/* Logout icon only for big screens */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex text-red-500 hover:text-red-600 transition"
                    title="Logout"
                  >
                    <LogOut size={20} className="text-black" />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/Login">
                    <button className="hidden sm:inline-block h-8 w-20 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-sm font-medium transition">
                      Login
                    </button>
                  </Link>
                  <Link to="/Signup">
                    <button className="hidden sm:inline-block h-8 w-20 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium transition">
                      Register
                    </button>
                  </Link>
                </>
              )}

              {/* Mobile Toggle */}
              <button
                className="sm:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden bg-white border-t border-slate-200 animate-slideDown">
            <ul className="flex flex-col space-y-2 p-4 text-gray-700 text-sm font-medium">
              {["Home", "Explore", "Vendors", "About"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="block w-full hover:text-primary transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}

              {!user ? (
                <>
                  <li>
                    <Link to="/Login" onClick={() => setIsOpen(false)}>
                      <button className="w-full h-8 mb-2 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 transition">
                        Login
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/Signup" onClick={() => setIsOpen(false)}>
                      <button className="w-full h-8 rounded-md bg-primary text-white hover:bg-primary/90 transition">
                        Register
                      </button>
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 h-8 rounded-md bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
