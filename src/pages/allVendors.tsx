import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getBaseUrl } from "../config/baseUrl";

interface Product {
  id: number;
  name: string;
  woodType: string;
  price: string;
  image?: string;
}

interface Vendor {
  id: number;
  company_name: string;
  company_email: string;
  company_location: string;
  image?: string;
  products?: Product[]; // include products if they exist
}

const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const baseURL = getBaseUrl();
        const response = await axios.get(`${baseURL}/users/verified`);
        console.log("Vendors API response:", response.data);

        const vendorListRaw = response.data.users ?? [];
        const vendorList = vendorListRaw.map((v: any) => ({
          id: v.id,
          company_name: v.company_name,
          company_email: v.email,
          company_location: v.company_location,
          image: v.company_logo || "",
          products: v.products || [], // fetch existing products if any
        }));

        setVendors(vendorList);
      } catch (err: any) {
        console.error("Error fetching vendors:", err);
        setError("Failed to load vendors. Please try again later.");
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      {/* Header */}
      <div
        className="relative w-full h-60 sm:h-72 md:h-80 lg:h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            All Vendors
          </h1>
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-200 mt-3 sm:mt-5">
            Discover all our trusted vendors
          </p>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="w-11/12 sm:w-10/12 mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {loading ? (
          <p className="text-center text-gray-500 col-span-full">Loading vendors...</p>
        ) : error ? (
          <p className="text-center text-red-500 col-span-full">{error}</p>
        ) : vendors.length > 0 ? (
          vendors.map((v) => (
            <div
              key={v.id}
              className="bg-white shadow-sm hover:shadow-lg rounded-xl p-3 transition cursor-pointer flex flex-col"
            >
              <img
                src={v.image || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={v.company_name}
                className="w-full h-52 sm:h-60 md:h-64 lg:h-72 object-cover rounded-lg"
              />
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg md:text-xl text-gray-800">
                    {v.company_name}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center mt-1">
                    <MapPin size={14} className="mr-1 text-[#4B341C]" />
                    {v.company_location}
                  </p>
                  <p className="text-gray-500 text-sm mt-1 break-words">
                    {v.company_email}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/vendorPage/${v.id}`, { state: { vendor: v } })
                  }
                  className="w-full bg-[#4B341C] text-white mt-4 py-2 rounded-lg font-medium hover:bg-[#3A2917]/90 transition text-sm sm:text-base"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full col-span-full">
            No vendors found.
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
