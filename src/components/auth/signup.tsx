import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  // Common Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  

  // Vendor-specific Fields
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [rdbCertificate, setRdbCertificate] = useState<File | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);

  const baseUrl = getBaseUrl();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !password) {
      return Notiflix.Notify.failure("Please fill in all required fields.");
    }

    if (
      userRole === "vendor" &&
      (!companyName || !location || !rdbCertificate || !nationalIdFile)
    ) {
      return Notiflix.Notify.failure("Please fill all vendor-required fields including uploads.");
    }

    try {
      Notiflix.Loading.circle("Creating your account...");

      const formData = new FormData();
      formData.append("firstname", firstName);
      formData.append("lastname", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("user_role", userRole);

      if (userRole === "vendor") {
        formData.append("company_name", companyName);
        formData.append("location", location);
        formData.append("rdb_certificate", rdbCertificate as Blob);
        formData.append("national_id_file", nationalIdFile as Blob);
      }

      const res = await axios.post(`${baseUrl}/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Notiflix.Loading.remove();
      Notiflix.Notify.success("Account created successfully!");
      const res = await axios.post(`${baseUrl}/users/register`, {
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        password,
        
      });

      Notiflix.Loading.remove();
      Notiflix.Notify.success("Account created successfully Check your email to verify.");
      console.log("Signup Success:", res.data);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err: any) {
      Notiflix.Loading.remove();
      console.error("Signup Error:", err);
      Notiflix.Notify.failure(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f9f7f4] to-[#f0ece8] p-4">
      <div className="flex flex-col items-center mb-6">
       
        <h2 className="mt-3 text-gray-800 text-sm font-medium">Create an Account</h2>
        <p className="text-xs text-gray-500">Join UbubajiHub today</p>
      </div>

      <form
        className="bg-white p-6 rounded-xl shadow-sm w-full max-w-md space-y-4"
        onSubmit={handleSignup}
        encType="multipart/form-data"
      >
        {/* Common Fields */}
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

              
  

        {/* Vendor Fields */}
        {userRole === "vendor" && (
          <>
            <div>
              <label className="text-xs text-gray-600">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ububaji Ltd"
                className="w-full border rounded-md px-2 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Company Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kigali, Rwanda"
                className="w-full border rounded-md px-2 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Upload National ID (PDF / Image)</label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setNationalIdFile(file);
                }}
                className="w-full border rounded-md px-2 py-2 text-sm file:mr-2"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Upload RDB Certificate (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setRdbCertificate(file);
                }}
                className="w-full border rounded-md px-2 py-2 text-sm file:mr-2"
                required
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
          <input type="checkbox" required />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </div>

        <button className="w-full bg-[#4B341C] text-white py-2 rounded-md text-sm font-medium hover:bg-[#4a372d] transition">
          Create Account
        </button>

        <p className="text-xs text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-[#4B341C] font-medium">
            Sign in
          </a>
        </p>

        <p className="text-[11px] text-center text-gray-400 mt-2">
          ← <a href="/" className="hover:underline">Back to Home</a>
        </p>
      </form>
    </div>
  );
}