import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye } from "lucide-react";
import axios from "axios";
import Notiflix from "notiflix";
import { getBaseUrl } from "../../config/baseUrl";

Notiflix.Notify.init({
  position: "right-top",
  timeout: 2500,
  clickToClose: true,
});

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Notiflix.Notify.failure("Passwords do not match!");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");

    if (!email || !otp) {
      Notiflix.Notify.failure("Missing email or OTP. Please retry the flow.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${getBaseUrl()}/vendors/reset-password`, {
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });

      // ✅ Treat HTTP 200 as success
      if (response.status === 200) {
        Notiflix.Notify.success(response.data?.message || "Password changed successfully!");

        // Clear localStorage
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");

        // Redirect to login after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        Notiflix.Notify.failure(response.data?.message || "Password reset failed.");
      }
    } catch (error: any) {
      Notiflix.Notify.failure(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f0ebe3] px-4">
      {/* Logo */}
      <div className="bg-[#6B4B3E] w-16 h-16 flex items-center justify-center rounded-md mb-6 shadow">
        <span className="text-white font-semibold text-lg">UH</span>
      </div>

      <h2 className="text-lg font-medium text-gray-700">Reset Password</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter your new password below to complete the reset process.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-lg shadow-md p-6"
      >
        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">New Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Confirm Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#6B4B3E] text-white hover:bg-[#5B3F33]"
          }`}
        >
          {loading ? "Submitting..." : "Confirm Password Change"}
        </button>

        {/* Back to login */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-[#6B4B3E] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </form>

      <Link
        to="/"
        className="mt-6 text-sm text-gray-600 hover:text-[#6B4B3E] transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
