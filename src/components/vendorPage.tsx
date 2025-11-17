import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import { getBaseUrl } from "../config/baseUrl";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  woodType?: string;
  price: string;
  images?: string[]; // Updated to match backend
  stock?: number;
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

const VendorPage: React.FC = () => {
  const location = useLocation();
  const vendorData = location.state?.vendor as Vendor | null;

  const baseURL = getBaseUrl();
  const [vendor, setVendor] = useState<Vendor | null>(vendorData);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState("Products");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendorData) return;

      try {
        // Fetch products by user_id (vendor id)
        const res = await axios.get(`${baseURL}/products/vendor/${vendorData.id}`);

        // Backend returns array of products
        setVendor((prev) =>
          prev ? { ...prev, products: res.data || [] } : prev
        );
      } catch (error) {
        console.error("Failed to fetch vendor products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [vendorData, baseURL]);

  if (!vendor) {
    return (
      <p className="text-center mt-10 text-red-500">
        Vendor data not available.
      </p>
    );
  }

  const backgroundImage =
    vendor.cover_image ||
    "https://via.placeholder.com/1200x400?text=Vendor+Background";

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src={backgroundImage}
          alt={`${vendor.company_name} background`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold text-center">
            {vendor.company_name}
          </h1>
        </div>
      </div>

      {/* Vendor Profile */}
      <div className="relative -mt-16 mx-auto w-11/12 max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            vendor.image ||
            "https://via.placeholder.com/150?text=Profile+Image"
          }
          alt={`${vendor.company_name} profile`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-800">
            {vendor.company_name}
          </h2>

          {/* Dynamic Rating */}
          <div className="flex justify-center sm:justify-start items-center gap-2 text-yellow-500 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  vendor.rating && i < Math.round(vendor.rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}

            <span className="font-medium text-gray-700">
              {vendor.rating?.toFixed(1) || "0.0"}
            </span>

            <span className="text-gray-500 text-sm">
              ({vendor.reviews || 0} reviews)
            </span>
          </div>

          <p className="text-gray-600 text-sm mt-1">
            {vendor.company_location}
          </p>
          {/* <p className="text-gray-500 text-sm mt-1 break-words">
            {vendor.company_email}
          </p> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="w-11/12 max-w-5xl mx-auto mt-6 flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
        {["Products", "About", "Reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium flex-shrink-0 transition-all ${
              activeTab === tab
                ? "text-[#4B341C] border-b-2 border-[#4B341C]"
                : "text-gray-500 hover:text-[#4B341C]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Tab */}
{activeTab === "Products" && (
  <div className="w-11/12 max-w-7xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-10">
    {loadingProducts ? (
      <div className="flex justify-center items-center py-20 col-span-full">
        <div className="w-10 h-10 border-4 border-[#4B341C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : vendor.products && vendor.products.length > 0 ? (
      vendor.products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
        >
          {/* Image */}
          <div className="overflow-hidden rounded-t-lg h-48">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/ph12.jpg"
              }
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-2">
            <h4 className="font-medium text-lg text-[#4B341C] truncate">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {product.woodType || "Wood type not specified"}
            </p>
            <p className="text-green-600 text-base font-semibold mt-1">
              RWF {product.price}
            </p>

            {/* Buttons */}
            <div className="flex justify-between gap-2 mt-3 flex-nowrap">
              <button className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-2 py-1 rounded-md transition">
                <Star className="w-4 h-4" /> View
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-1 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-sm px-2 py-1 rounded-md transition"
                onClick={() =>
                  console.log("Add to cart clicked:", product.name)
                }
              >
                <ShoppingCartIcon className="w-4 h-4" /> Add
              </button>

              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm transition">
                <HeartIcon className="w-4 h-4" /> Wishlist
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 col-span-full text-center">
        No products available yet.
      </p>
    )}
  </div>
)}


      {/* About Tab */}
      {activeTab === "About" && (
        <div className="w-11/12 max-w-4xl mx-auto mt-6 text-gray-700 pb-10 leading-relaxed">
          <p>
            {vendor.company_name} specializes in handcrafted wooden furniture,
            designed with precision and attention to detail to enhance homes and
            offices across Rwanda.
          </p>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "Reviews" && (
        <div className="w-11/12 max-w-4xl mx-auto mt-6 text-gray-700 pb-10">
          <p>No reviews yet. Be the first to leave feedback!</p>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
