import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { getBaseUrl } from "../config/baseUrl";

interface Product {
  id: number;
  name: string;
  woodType?: string;
  price: string;
  images: string[];
}

interface Review {
  id: number;
  title: string;
  comment: string;
  rating: number;
  customer_firstname: string;
  customer_lastname: string;
}

interface Vendor {
  id: number;
  company_name: string;
  company_email?: string;
  company_location: string;
  image?: string;
  cover_image?: string;
}

const VendorPage: React.FC = () => {
  const location = useLocation();
  const vendor = location.state?.vendor as Vendor | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [activeTab, setActiveTab] = useState("Products");

  const [loadingVendor, setLoadingVendor] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const baseURL = getBaseUrl();

  useEffect(() => {
    if (!vendor) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${baseURL}/products/vendor/${vendor.id}`);
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${baseURL}/reviews/${vendor.id}`);
        setReviews(res.data.reviews || []);
        setAverageRating(parseFloat(res.data.average_rating) || 0);
        setTotalReviews(res.data.total_reviews || 0);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoadingVendor(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, [vendor]);

  if (!vendor) {
    return <p className="text-center mt-10 text-red-500">Vendor data not available.</p>;
  }

  const backgroundImage =
    vendor.cover_image || "https://via.placeholder.com/1200x400?text=Vendor+Background";

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans mt-16">

      {/* Hero */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Vendor background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">{vendor.company_name}</h1>
        </div>
      </div>

      {/* Vendor Profile */}
      <div className="relative -mt-16 max-w-7xl mx-auto px-[4%]">
        <div className="bg-white w-full shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6 border">

          {loadingVendor ? (
            <>
              <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="flex-1 space-y-3 animate-pulse text-center sm:text-left">
                <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/5"></div>
              </div>
            </>
          ) : (
            <>
              <img
                src={vendor.image || "https://via.placeholder.com/150?text=Profile+Image"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800">{vendor.company_name}</h2>
                <div className="flex items-center mt-1 justify-center sm:justify-start">
                  <Star className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-1">({totalReviews} reviews)</span>
                </div>
                <p className="text-gray-600 mt-1">{vendor.company_location}</p>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-[4%] mt-6 flex border-b border-gray-200">
        {["Products", "About", "Reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-[#4B341C] text-[#4B341C]"
                : "text-gray-500 hover:text-[#4B341C]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products */}
      {activeTab === "Products" && (
        <section className="pt-10 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-[4%]">
            <h2 className="text-xl font-semibold mb-6 text-[#4B341C]">
              Products
            </h2>

            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow p-4 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded mt-4 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded mt-4 w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
                  >
                    <div className="overflow-hidden rounded-t-lg h-48">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "https://via.placeholder.com/400x300"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <h4 className="font-medium text-lg text-[#4B341C] truncate">
                        {product.name}
                      </h4>

                      <p className="text-sm text-gray-600 truncate">
                        {product.woodType || "Wooden Product"}
                      </p>

                      <p className="text-green-600 text-base font-semibold mt-1">
                        RWF {product.price}
                      </p>

                      <div className="flex justify-between gap-2 mt-3 flex-nowrap">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-2 py-1 rounded-md transition">
                          View
                        </button>

                        <button className="flex-1 flex items-center justify-center gap-1 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-sm px-2 py-1 rounded-md transition">
                          Add
                        </button>

                        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm transition">
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 col-span-full">No products available.</p>
            )}
          </div>
        </section>
      )}

      {/* About */}
      {activeTab === "About" && (
        <div className="w-11/12 max-w-4xl mx-auto mt-6 text-gray-700 leading-relaxed p-4 bg-white rounded-md shadow">
          <p>{vendor.company_name} specializes in handcrafted wooden furniture made with precision.</p>
        </div>
      )}

      {/* ⭐ NEW REVIEWS SECTION */}
      {activeTab === "Reviews" && (
        <section className="pt-10 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-[4%]">

            <h2 className="text-xl font-semibold mb-6 text-[#4B341C]">
              Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div key={r.id} className="pb-4 border-b border-gray-300">

                    {/* Review title */}
                    <p className="font-semibold text-[#4B341C] text-lg">
                      {r.title}
                    </p>

                    {/* Stars */}
                    <div className="flex mt-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-yellow-500 fill-yellow-500 h-5 w-5"
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 mt-2">{r.comment}</p>

                    {/* User */}
                    <p className="text-sm text-gray-500 mt-1">
                      By {r.customer_firstname} {r.customer_lastname}
                    </p>

                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};

export default VendorPage;
