import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import axios from "axios";
import Notiflix from "notiflix";
import { getBaseUrl } from "../../config/baseUrl";

export default function VendorForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      Notiflix.Notify.failure("Please enter your company email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${getBaseUrl()}/vendors/send-otp`, {
        email: email.trim(),
      });

      //  Flexible success detection
      const isSuccess =
        res.status === 200 &&
        (res.data?.success === true ||
          res.data?.status === "success" ||
          res.data?.message?.toLowerCase().includes("otp"));

      if (isSuccess) {
        Notiflix.Notify.success("OTP sent successfully! Check your email.");
        localStorage.setItem("resetEmail", email);
        navigate("/otp-verification");
      } else {
        Notiflix.Notify.failure(
          res.data?.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      Notiflix.Notify.failure(
        err.response?.data?.message || "An error occurred while sending OTP."
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

      <h2 className="text-lg font-medium text-gray-700">Forgot Password</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter your registered email to receive password reset instructions.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Email Address</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Mail size={16} className="text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@umubajihub.com"
              className="w-full px-2 py-2 outline-none text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white transition ${
            loading
              ? "bg-[#8d6f63] cursor-not-allowed"
              : "bg-[#6B4B3E] hover:bg-[#5B3F33]"
          }`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-[#6B4B3E] font-medium hover:underline"
          >
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
