import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your registered email address.");
      return;
        
    }

    // TODO: Replace with your axios POST request to backend
    navigate("/otp-verification");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f0ebe3] px-4">
  
      <div className="bg-[#4B341C] w-16 h-16 flex items-center justify-center rounded-md mb-6 shadow">
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
          <label className="block text-sm mb-1 text-gray-700"> Email Address</label>
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

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-[#4B341C] text-white py-2 rounded-md hover:bg-[#5B3F33] transition"
        >
         Send OTP 
        </button>

        {/* Back to login */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-[#4B341C] font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>

      <Link
        to="/"
        className="mt-6 text-sm text-gray-600 hover:text-[#4B341C] transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
