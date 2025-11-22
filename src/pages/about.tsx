import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Star } from "lucide-react";
import { getBaseUrl } from "../config/baseUrl";


interface Product {
  id: number;
  name: string;
  woodType?: string;
  price?: string;
  image?: string;
}

interface Vendor {
  id: number;
  company_name: string;
  company_email?: string;
  company_location: string;
  image?: string;
  cover_image?: string;
  products?: Product[];
  rating?: number;
  reviews?: number;
}

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = getBaseUrl();

  const getRatingColor = (r: number) => {
    if (r <= 1) return "text-red-500 fill-red-500";
    if (r <= 3) return "text-yellow-400 fill-yellow-400";
    return "text-green-500 fill-green-500";
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/users/verified`);
        const vendorListRaw = response.data.users ?? [];

        const vendorList: Vendor[] = vendorListRaw.map((v: any) => ({
          id: v.id,
          company_name: v.company_name,
          company_email: v.email,
          company_location: v.company_location,
          image: v.company_logo || "",
          cover_image: v.company_cover_photo || "",
          products: v.products || [],
          rating: 0,
          reviews: 0,
        }));

        // Show only first 4 vendors for AboutUs
        const limitedVendors = vendorList.slice(0, 4);
        setVendors(limitedVendors);

        await Promise.all(
          limitedVendors.map(async (v) => {
            try {
              const res = await axios.get(`${baseURL}/reviews/${v.id}`);
              const avg = parseFloat(res.data.average_rating) || 0;
              const totalReviews = res.data.total_reviews || 0;

              setVendors((prev) =>
                prev.map((vendor) =>
                  vendor.id === v.id
                    ? { ...vendor, rating: avg, reviews: totalReviews }
                    : vendor
                )
              );
            } catch (err) {
              console.error(`Failed to fetch reviews for vendor ${v.id}`, err);
            }
          })
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load vendors.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="font-sans bg-[#F5F5F5] text-[#4B341C] overflow-x-hidden">
      {/* 🌟 Hero Section */}
      <section
        className="relative h-[60vh] w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url(/ph12.jpg)" }}
      >
        <div className="bg-black/50 w-full h-full flex items-center justify-center px-4">
          <div className="text-center max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
              About UmubajiHub
            </h1>
            <p className="mt-4 text-lg md:text-xl drop-shadow">
              Connecting talented vendors with customers who value handmade furniture and craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* 🪵 Our Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-[4%] text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            At UmubajiHub, our mission is to empower local woodworking vendors and artisans by providing them with a platform to showcase their unique products, connect with customers, and grow their businesses. We aim to promote quality craftsmanship while making it easy for buyers to find custom, handmade furniture.
          </p>
        </div>
      </section>

      {/* 👥 How It Works */}
      <section className="py-16 bg-[#FFF3EC]">
        <div className="max-w-7xl mx-auto px-[4%] text-center">
          <h2 className="text-3xl font-bold mb-10">How UmubajiHub Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              img="/ph8.jpg"
              title="For Vendors"
              desc="Sign up to create your shop, list your handmade furniture, and reach customers across Rwanda."
            />
            <FeatureCard
              img="/ph9.jpg"
              title="For Customers"
              desc="Browse products, discover talented vendors, and order quality, handmade furniture with ease."
            />
            <FeatureCard
              img="/ph10.jpg"
              title="Community Support"
              desc="Join a community that values local craftsmanship, supports artisans, and promotes sustainable furniture practices."
            />
          </div>
        </div>
      </section>

      {/* 📦 Vendors Showcase (from VendorsPage logic) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Vendors</h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#4B341C] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {vendors.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#F5F5F5] rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={v.image || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={v.company_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-lg text-[#4B341C] truncate">
                        {v.company_name}
                      </h3>

                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin size={14} className="mr-1 text-[#4B341C]" />
                        {v.company_location}
                      </p>

                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`mr-1 ${
                              v.reviews && i < Math.round(v.rating || 0)
                                ? getRatingColor(Math.round(v.rating || 0))
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/vendorPage/${v.id}`, { state: { vendor: v } })}
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
        </div>
      </section>

      {/* ✨ CTA Section */}
      <section className="py-20 text-center bg-[#FFF3EC]">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Join UmubajiHub Today</h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto">
            Whether you’re a vendor showcasing your handmade creations or a customer looking for quality furniture, UmubajiHub connects you with the best local artisans.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Link to="/signup">
              <button className="bg-[#4B341C] text-white px-6 py-3 font-semibold text-base rounded-md shadow hover:bg-[#3b2a15] transition">
                Join as a Vendor
              </button>
            </Link>
            <Link to="/explore">
              <button className="bg-white text-[#4B341C] px-6 py-3 font-medium rounded-md shadow hover:bg-[#eeeae6] transition">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// FeatureCard Component
const FeatureCard = ({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) => (
  <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
    <div className="h-48 overflow-hidden rounded-t-lg">
      <img src={img} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6 text-center">
      <h3 className="font-semibold text-lg text-[#4B341C]">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  </div>
);

export default AboutUs;
