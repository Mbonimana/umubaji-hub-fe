import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notiflix from "notiflix";

Notiflix.Notify.init({
  position: "right-top",
  timeout: 2500,
  clickToClose: true,
});

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace: clear all fields
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Notiflix.Notify.failure("Please enter the 6-digit OTP code.");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      Notiflix.Notify.failure("Missing email. Go back to Forgot Password page.");
      return;
    }

    //  Save OTP in localStorage for password reset
    localStorage.setItem("resetOtp", enteredOtp);

    Notiflix.Notify.success("OTP verified successfully!");
    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f0ebe3] px-4">
      {/* Logo */}
      <div className="bg-[#6B4B3E] w-16 h-16 flex items-center justify-center rounded-md mb-6 shadow">
        <span className="text-white font-semibold text-lg">UH</span>
      </div>

      <h2 className="text-lg font-medium text-gray-700">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter the 6-digit code sent to your registered email address.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-lg shadow-md p-6"
      >
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              ref={(el) => {inputsRef.current[index] = el;}}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={handleKeyDown}
              className="w-10 h-10 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:border-[#6B4B3E]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-[#6B4B3E] text-white hover:bg-[#5B4B3E] transition"
        >
          Verify OTP
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Didn’t receive the code?{" "}
          <button
            type="button"
            onClick={() => Notiflix.Notify.info("Resend OTP triggered")}
            className="text-[#6B4B3E] font-medium hover:underline"
          >
            Resend
          </button>
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
