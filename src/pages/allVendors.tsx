import React, { useState } from "react";
import { Star, MapPin } from "lucide-react";

interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: string;
  image: string;
}

const VendorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Category" | "All">("Category");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Master Crafts Ltd",
      category: "Tables",
      location: "Lagos, Nigeria",
      rating: 4.8,
      reviews: 124,
      priceRange: "₦50,000 - ₦600,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Woodwork Artisans",
      category: "Chairs",
      location: "Abuja, Nigeria",
      rating: 4.6,
      reviews: 98,
      priceRange: "₦30,000 - ₦350,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Premium Furniture Co",
      category: "Custom Work",
      location: "Port Harcourt, Nigeria",
      rating: 4.9,
      reviews: 156,
      priceRange: "₦75,000 - ₦800,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Elegant Interiors",
      category: "Tables",
      location: "Kigali, Rwanda",
      rating: 4.7,
      reviews: 112,
      priceRange: "RWF 150,000 - RWF 1,200,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Rustic Touch Furniture",
      category: "Chairs",
      location: "Accra, Ghana",
      rating: 4.5,
      reviews: 87,
      priceRange: "₵2,000 - ₵15,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "TimberLine Works",
      category: "Custom Work",
      location: "Nairobi, Kenya",
      rating: 4.6,
      reviews: 140,
      priceRange: "KSh 20,000 - KSh 300,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "African Art Furniture",
      category: "Tables",
      location: "Kampala, Uganda",
      rating: 4.7,
      reviews: 132,
      priceRange: "UGX 500,000 - UGX 3,000,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "HomeCraft Studio",
      category: "Chairs",
      location: "Dar es Salaam, Tanzania",
      rating: 4.9,
      reviews: 156,
      priceRange: "TSh 500,000 - TSh 2,000,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 9,
      name: "Carve & Design",
      category: "Custom Work",
      location: "Johannesburg, South Africa",
      rating: 4.8,
      reviews: 205,
      priceRange: "R 5,000 - R 50,000",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const categories = ["All", "Tables", "Chairs", "Custom Work"];

  const filteredVendors =
    selectedCategory === "All"
      ? vendors
      : vendors.filter((v) => v.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Find Skilled Furniture Vendors
        </h1>

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-8">
          {["Category", "All"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "Category" | "All")}
              className={`px-6 py-2 text-lg font-medium transition-all ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category View */}
        {activeTab === "Category" && (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-lg border transition-all ${
                    selectedCategory === cat
                      ? "bg-secondary text-white border-primary"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVendors.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="h-64 rounded-t-xl overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-800 font-semibold text-lg">{v.name}</h3>
                    <div className="flex items-center text-yellow-500 gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{v.rating}</span>
                      <span className="text-gray-500 text-sm">({v.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mt-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {v.location}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Price range: {v.priceRange}</p>
                    <button className="w-full bg-secondary text-white mt-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* All Vendors View */}
        {activeTab === "All" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="h-64 rounded-t-xl overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-gray-800 font-semibold text-lg">{v.name}</h3>
                  <div className="flex items-center text-yellow-500 gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{v.rating}</span>
                    <span className="text-gray-500 text-sm">({v.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mt-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    {v.location}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Price range: {v.priceRange}</p>
                  <button className="w-full bg-secondary text-white mt-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
