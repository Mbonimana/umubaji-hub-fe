import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, User, Lock, MapPin, Building } from "lucide-react";
import axios from "axios";
import Notiflix from "notiflix";
import { getBaseUrl } from "../../config/baseUrl";

Notiflix.Notify.init({
  position: "right-top",
  timeout: 2500,
  clickToClose: true,
  cssAnimationStyle: "zoom",
});

export default function Signup() {
  const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");
  const [showPassword, setShowPassword] = useState(false);

  // Customer fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Vendor fields
  const [adminName, setAdminName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorPassword, setVendorPassword] = useState("");

  const baseUrl = getBaseUrl();

  const handleCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !password) {
      Notiflix.Notify.failure("Please fill in all fields ");
      return;
    }

    Notiflix.Loading.circle("Creating your account...");
    try {
      const res = await axios.post(`${baseUrl}/users/register`, {
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        password,
      });

      Notiflix.Loading.remove();
      Notiflix.Notify.success("Account created successfully 🎉");
      console.log("Customer Signup Success:", res.data);

      // Optional redirect after successful signup
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (err: any) {
      Notiflix.Loading.remove();
      console.error("Signup Failed:", err);
      Notiflix.Notify.failure(err.response?.data?.message || "Signup failed ");
    }
  };

  const handleVendorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !companyName || !companyEmail || !companyLocation || !vendorPhone || !vendorPassword) {
      Notiflix.Notify.failure("Please fill in all fields ");
      return;
    }

    Notiflix.Loading.circle("Registering vendor...");
    try {
      const res = await axios.post(`${baseUrl}/vendors/register`, {
        full_admin_name: adminName,
        company_name: companyName,
        company_email: companyEmail,
        company_location: companyLocation,
        phone: vendorPhone,
        password: vendorPassword,
      });

      Notiflix.Loading.remove();
      Notiflix.Notify.success("Vendor registered successfully ");
      console.log("Vendor Signup Success:", res.data);

      // Optional redirect
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (err: any) {
      Notiflix.Loading.remove();
      console.error("Vendor Signup Failed:", err);
      Notiflix.Notify.failure(err.response?.data?.message || "Signup failed ");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f9f7f4] to-[#f0ece8] p-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-md bg-[#5c4338] flex items-center justify-center text-white font-semibold">
          UH
        </div>
        <h2 className="mt-3 text-gray-800 text-sm font-medium">Create an Account</h2>
        <p className="text-xs text-gray-500">Join UbubajiHub today</p>
      </div>

      {/* Toggle */}
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

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-md">
        {activeTab === "customer" ? (
          <form className="space-y-4" onSubmit={handleCustomerSignup}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">First Name</label>
                <div className="flex items-center border rounded-md px-2">
                  <User className="w-4 h-4 text-gray-500 mr-1" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Manasseh"
                    className="w-full py-2 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Last Name</label>
                <div className="flex items-center border rounded-md px-2">
                  <User className="w-4 h-4 text-gray-500 mr-1" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="MBONIMANA"
                    className="w-full py-2 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Email</label>
              <div className="flex items-center border rounded-md px-2">
                <Mail className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Phone Number</label>
              <div className="flex items-center border rounded-md px-2">
                <Phone className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 780 000 000"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Password</label>
              <div className="flex items-center border rounded-md px-2">
                <Lock className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 outline-none text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
              <input type="checkbox" required />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </div>

            <button className="w-full bg-[#4B341C] text-white py-2 rounded-md text-sm font-medium hover:bg-[#4a372d] transition">
              Create Account
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVendorSignup}>
            <div>
              <label className="text-xs text-gray-600">Full Admin Name</label>
              <div className="flex items-center border rounded-md px-2">
                <User className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Manasseh MBONIMANA"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Company Name</label>
              <div className="flex items-center border rounded-md px-2">
                <Building className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="UbubajiHub Ltd"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Company Email</label>
              <div className="flex items-center border rounded-md px-2">
                <Mail className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="admin@ububajihub.com"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Company Location</label>
              <div className="flex items-center border rounded-md px-2">
                <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="text"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  placeholder="Kigali, Rwanda"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Phone Number</label>
              <div className="flex items-center border rounded-md px-2">
                <Phone className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type="text"
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  placeholder="+250 780 000 000"
                  className="w-full py-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Password</label>
              <div className="flex items-center border rounded-md px-2">
                <Lock className="w-4 h-4 text-gray-500 mr-1" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={vendorPassword}
                  onChange={(e) => setVendorPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 outline-none text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
              <input type="checkbox" required />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </div>

            <button className="w-full bg-[#5c4338] text-white py-2 rounded-md text-sm font-medium hover:bg-[#4a372d] transition">
              Create Account
            </button>
          </form>
        )}

        <p className="text-xs text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-[#5c4338] font-medium">
            Sign in
          </a>
        </p>

        <p className="text-[11px] text-center text-gray-400 mt-2">
          ← <a href="/" className="hover:underline">Back to Home</a>
        </p>
      </div>
    </div>
  );
}