import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getBaseUrl } from "../../config/baseUrl";
import Notiflix from "notiflix";

Notiflix.Notify.init({
  position: "right-top",
  timeout: 2500,
  clickToClose: true,
  cssAnimationStyle: "zoom",
});

export default function VendorRegistration() {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyCoverImage, setCompanyCoverImage] = useState<File | null>(null);
  const [rdbCertificate, setRdbCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName || !companyLocation || !companyPhone || !companyDescription) {
      return Notiflix.Notify.failure("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("user_id", userId || "");
    formData.append("company_name", companyName);
    formData.append("company_location", companyLocation);
    formData.append("company_phone", companyPhone);
    formData.append("company_description", companyDescription);
    if (companyLogo) formData.append("company_logo", companyLogo);
    if (companyCoverImage) formData.append("company_coverimage", companyCoverImage);
    if (rdbCertificate) formData.append("rdb_certificate", rdbCertificate);

    setLoading(true);
    Notiflix.Loading.circle("Submitting your request...");

    try {
      const res = await axios.post(`${getBaseUrl()}/vendorProfile/register`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      Notiflix.Loading.remove();
      Notiflix.Notify.success(res.data.message || "Vendor registration submitted successfully!");
      navigate("/login");

      // Optional: reset form
      setCompanyName("");
      setCompanyLocation("");
      setCompanyPhone("");
      setCompanyDescription("");
      setCompanyLogo(null);
      setCompanyCoverImage(null);
      setRdbCertificate(null);
    } catch (err: any) {
      Notiflix.Loading.remove();
      console.error(err.response || err);
      const errorMessage = err.response?.data?.message || err.message || "Error submitting vendor registration";
      Notiflix.Notify.failure(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f0ebe3] px-4 py-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Vendor Verification Request</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Complete your company details below. Your submission will be reviewed by our admin team.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-8 space-y-6 transition-all duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#4B341C] focus:border-[#4B341C] shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Company Phone</label>
              <input
                type="tel"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="Enter company phone"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#4B341C] focus:border-[#4B341C] shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Company Description</label>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="Briefly describe your company"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#4B341C] focus:border-[#4B341C] shadow-sm resize-none"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Company Location</label>
              <input
                type="text"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
                placeholder="Enter company location"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#4B341C] focus:border-[#4B341C] shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Company Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(setCompanyLogo)}
                className="w-full text-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Company Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(setCompanyCoverImage)}
                className="w-full text-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">RDB Certificate</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange(setRdbCertificate)}
                className="w-full text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Button with Spinner */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#4B341C] hover:bg-[#5B3F33] text-white font-semibold py-3 rounded-lg text-lg transition-all"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loading ? "Submitting..." : "Request to be Verified"}
        </button>
      </form>

      <Link to="/" className="mt-8 text-gray-600 hover:text-[#4B341C] text-sm transition-all">
        ← Back to Home
      </Link>
    </div>
  );
}
