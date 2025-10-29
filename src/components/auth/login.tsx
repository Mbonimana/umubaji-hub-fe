import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import axios from "axios";
import Notiflix from "notiflix";
import { getBaseUrl } from "../../config/baseUrl";

Notiflix.Notify.init({
  position: "right-top",
  timeout: 2500,
  clickToClose: true,
  cssAnimationStyle: "zoom",
});

type LoginResponse = {
  user?: {
    id: string;
    email: string;
    access_token?: string;
    [key: string]: any;
  };

  access_token?: string;
  accessToken?: string;
  message?: string;
};
type VendorLoginResponse = {
  vendor?: {
    id: string;
    company_email: string;
    access_token?: string;
    [key: string]: any;

    
  };
   access_token?: string;
  accessToken?: string;
  message?: string;
};

export default function Login() {
  const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorPassword, setVendorPassword] = useState("");
  const navigate = useNavigate();

  const baseUrl = getBaseUrl();

  //  CUSTOMER LOGIN
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail || !customerPassword) {
      return Notiflix.Notify.failure("Please fill in all fields");
    }

    Notiflix.Loading.dots("Logging in...");
    try {
      const res = await axios.post<LoginResponse>(`${baseUrl}/users/login`, {
        email: customerEmail,
        password: customerPassword,
      });

      Notiflix.Loading.remove();
      const user = res.data.user;
      const token = res.data.access_token || user?.access_token;

      if (!user || !token) {
        return Notiflix.Notify.failure("Invalid response from server");
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      Notiflix.Notify.success("Customer logged in successfully");
      console.log(" Customer Login Success:", res.data);
      navigate("/");
    } catch (err: any) {
      Notiflix.Loading.remove();
      console.error(" Customer Login Failed:", err);
      Notiflix.Notify.failure(err.response?.data?.message || "Login failed");
    }
  };

  // VENDOR LOGIN
  const handleVendorLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!vendorEmail || !vendorPassword) {
    return Notiflix.Notify.failure("Please fill in all fields");
  }

  Notiflix.Loading.dots("Logging in...");
  try {
    const res = await axios.post<VendorLoginResponse>(`${baseUrl}/vendors/login`, {
      company_email: vendorEmail,
      password: vendorPassword,
    });

    Notiflix.Loading.remove();

    const vendor = res.data.vendor;
    const token = vendor?.access_token;

    if (!vendor || !token) {
      return Notiflix.Notify.failure("Invalid response from server");
    }

    // Save vendor + token
    localStorage.setItem("Vendor", JSON.stringify(vendor));
    localStorage.setItem("token", token);

    Notiflix.Notify.success("Vendor logged in successfully");
    console.log("Vendor Login Success:", res.data);

    navigate("/vendordashboard");
  } catch (err: any) {
    Notiflix.Loading.remove();
    console.error(" Vendor Login Failed:", err);
    Notiflix.Notify.failure(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f0ebe3] px-4">
      <div className="bg-[#6B4B3E] w-16 h-16 flex items-center justify-center rounded-md mb-6 shadow">
        <span className="text-white font-semibold text-lg">UH</span>
      </div>

      <h2 className="text-lg font-medium text-gray-700">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

      <div className="flex w-full max-w-sm bg-[#e8d8c3] rounded-full p-1 mb-6 h-8">
        <button
          onClick={() => setActiveTab("customer")}
          className={`w-1/2 rounded-full text-sm font-medium transition ${
            activeTab === "customer" ? "bg-white text-black shadow" : "text-black"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setActiveTab("vendor")}
          className={`w-1/2 rounded-full text-sm font-medium transition ${
            activeTab === "vendor" ? "bg-white text-black shadow" : "text-gray-600"
          }`}
        >
          Vendor
        </button>
      </div>

      {activeTab === "customer" && (
        <form
          onSubmit={handleCustomerLogin}
          className="bg-white w-full max-w-sm rounded-lg shadow-md p-6 transition-all duration-300"
        >
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700">User Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-2 py-2 outline-none text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={customerPassword}
                onChange={(e) => setCustomerPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-2 py-2 outline-none text-sm"
              />
              <Eye
                size={16}
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-[#6B4B3E] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6B4B3E] text-white py-2 rounded-md hover:bg-[#5B3F33] transition"
          >
            Sign In
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#6B4B3E] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      )}

      {activeTab === "vendor" && (
        <form
          onSubmit={handleVendorLogin}
          className="bg-white w-full max-w-sm rounded-lg shadow-md p-6 transition-all duration-300"
        >
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700">Company Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                placeholder="Enter your company email"
                className="w-full px-2 py-2 outline-none text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={vendorPassword}
                onChange={(e) => setVendorPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-2 py-2 outline-none text-sm"
              />
              <Eye
                size={16}
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/vendor-forgot-password" className="text-sm text-[#6B4B3E] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6B4B3E] text-white py-2 rounded-md hover:bg-[#5B3F33] transition"
          >
            Sign In
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#6B4B3E] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      )}

      <Link to="/" className="mt-6 text-sm text-gray-600 hover:text-[#6B4B3E] transition">
        ← Back to Home
      </Link>
    </div>
  );
}
