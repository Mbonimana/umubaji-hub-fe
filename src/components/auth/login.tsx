import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import axios from "axios";
import Notiflix from "notiflix";
import { getBaseUrl } from "../../config/baseUrl";
import { jwtDecode } from "jwt-decode";

Notiflix.Notify.init({
  position: "right-top",
  timeout: 2500,
  clickToClose: true,
  cssAnimationStyle: "zoom",
});

type LoginResponse = {
  access_token?: string;
  message?: string;
};

type DecodedToken = {
  id: string;
  email: string;
  user_role: "customer" | "vendor" | "admin";
  [key: string]: any;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const baseUrl = getBaseUrl();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return Notiflix.Notify.failure("Please fill in all fields");

    Notiflix.Loading.dots("Logging in...");
    try {
      const res = await axios.post<LoginResponse>(`${baseUrl}/users/login`, { email, password });
      Notiflix.Loading.remove();

      const token = res.data.access_token;
      if (!token) return Notiflix.Notify.failure("Invalid credentials");

      // Decode JWT to get user info & role
      const user = jwtDecode<DecodedToken>(token);

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("userLoggedIn"));

      Notiflix.Notify.success(`${user.user_role} logged in successfully`);

      // Redirect based on role
      switch (user.user_role) {
        case "admin":
          navigate("/adminDashboard");
          break;
        case "vendor":
          navigate("/vendorDashboard");
          break;
        default:
          navigate("/");
          break;
      }

    } catch (err: any) {
      Notiflix.Loading.remove();
      console.error("Login Failed:", err);
      Notiflix.Notify.failure(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f0ebe3] px-4">
      <div className="bg-[#4B341C] w-16 h-16 flex items-center justify-center rounded-md mb-6 shadow">
        <span className="text-white font-semibold text-lg">UH</span>
      </div>

      <h2 className="text-lg font-medium text-gray-700">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

      <form onSubmit={handleLogin} className="bg-white w-full max-w-sm rounded-lg shadow-md p-6 transition-all duration-300">
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Mail size={16} className="text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-2 py-2 outline-none text-sm"
            />
            <Eye size={16} onClick={() => setShowPassword(!showPassword)} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-[#6B4B3E] hover:underline">Forgot password?</Link>
        </div>

        <button type="submit" className="w-full bg-[#4B341C] text-white py-2 rounded-md hover:bg-[#5B3F33] transition">
          Sign In
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account? <Link to="/signup" className="text-[#4B341C] font-medium hover:underline">Sign up</Link>
        </p>
        <div>
        <span className="text-xs text-gray-500 mt-2">Demo Credentials:</span>
        <p className="text-xs text-gray-500 mt-2">Customer - email: customer@umubajihub.com</p>
        <p className="text-xs text-gray-500 mt-2">Vendor - email: vendor@umubajihub.com</p>
        <p className="text-xs text-gray-500 mt-2">Admin - email: admin@umubajihub.com</p>
        <p className="text-xs text-gray-500 mt-2">Password: okok</p>
      </div>
      </form>
     
      <Link to="/" className="mt-6 text-sm text-gray-600 hover:text-[#4B341C] transition">← Back to Home</Link>
    </div>
  );
}
