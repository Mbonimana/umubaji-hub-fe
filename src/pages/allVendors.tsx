import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
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
  cover_image?: string;
  products?: Product[];
  rating?: number;
  reviews?: number;
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

        const vendorListRaw = response.data.users ?? [];
        const vendorList = vendorListRaw.map((v: any) => ({
          id: v.id,
          company_name: v.company_name,
          company_email: v.email,
          company_location: v.company_location,
          image: v.company_logo || "",
          cover_image: v.company_cover_photo || "",
          products: v.products || [],
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 - 5.0
          reviews: Math.floor(Math.random() * 200) + 20, // 20 - 220 reviews
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
    <div>
      {/* Header Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">
            All Vendors
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-200 max-w-xl">
            Discover all our trusted vendors and their craftsmanship.
          </p>
        </div>
      </div>

      {/* Vendor Cards Section */}
      <section className="max-w-7xl mx-auto px-[4%] py-16">
        <h2 className="text-xl font-semibold mb-8 text-[#4B341C]">
          Our Verified Vendors
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading vendors...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      v.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={v.company_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-semibold text-lg text-[#4B341C] truncate">
                      {v.company_name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin size={14} className="mr-1 text-[#4B341C]" />
                      {v.company_location}
                    </p>

                    {/* ⭐ Rating Display */}
                    <div className="flex items-center mt-2">
                      <Star
                        size={18}
                        className="text-yellow-400 fill-yellow-400 mr-1"
                      />
                      <span className="font-semibold text-gray-800">
                        {v.rating?.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({v.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      navigate(`/vendorPage/${v.id}`, { state: { vendor: v } })
                    }
                    className="w-full mt-4 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-sm font-semibold py-2 rounded-md transition"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No vendors found.</p>
        )}
      </section>
    </div>
  );
};

export default VendorsPage;
