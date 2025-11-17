import React, { useEffect, useState } from "react";
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
  products: Product[];
  rating: number;
  reviews: number;
}

const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = getBaseUrl();

  // -----------------------------------------
  // FETCH VENDORS + THEIR PRODUCTS + REVIEWS
  // -----------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch base vendor list
        const vendorRes = await axios.get(`${baseURL}/users/verified`);
        const rawVendors = vendorRes.data.users || [];

        // Map vendors
        const vendorList: Vendor[] = rawVendors.map((v: any) => ({
          id: v.id,
          company_name: v.company_name,
          company_email: v.email,
          company_location: v.company_location,
          image: v.company_logo,
          cover_image: v.company_cover_photo,
          products: [],
          rating: 0,
          reviews: 0,
        }));

        // 2️⃣ Fetch products + reviews for each vendor
        await Promise.all(
          vendorList.map(async (vendor) => {
            try {
              // PRODUCTS
              const productRes = await axios.get(
                `${baseURL}/products/vendor/${vendor.id}`
              );

              vendor.products = productRes.data.products || [];

              // REVIEWS
              const reviewRes = await axios.get(`${baseURL}/reviews/${vendor.id}`);
              vendor.rating = parseFloat(reviewRes.data.average_rating);
              vendor.reviews = reviewRes.data.total_reviews;
            } catch (err) {
              console.error("Failed fetching vendor data:", err);
            }
          })
        );

        setVendors(vendorList);
      } catch (err) {
        console.error(err);
        setError("Failed to load vendors.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Header */}
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

      {/* Vendors */}
      <section className="max-w-7xl mx-auto px-[4%] py-16">
        <h2 className="text-xl font-semibold mb-8 text-[#4B341C]">
          Our Verified Vendors
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading vendors...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : vendors.length === 0 ? (
          <p className="text-center text-gray-500">No vendors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
              >
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

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-[#4B341C] truncate">
                    {v.company_name}
                  </h3>

                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin size={14} className="mr-1 text-[#4B341C]" />
                    {v.company_location}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`mr-1 ${
                          v.rating && i < Math.round(v.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({v.reviews})
                    </span>
                  </div>

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
        )}
      </section>
    </div>
  );
};

export default VendorsPage;
