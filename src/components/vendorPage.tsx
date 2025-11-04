import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, MessageSquare } from "lucide-react";

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
  company_location: string;
  image?: string;
  products: Product[];
}

// ✅ Dummy vendors + products
const dummyVendors: Vendor[] = [
  {
    id: 1,
    company_name: "Master Crafts Ltd",
    company_location: "Kigali, Rwanda",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS_d3n2b819ECRjI5t_QJj6kk7Gz0HZZOlnA&s",
    products: [
      {
        id: 1,
        name: "Modern Dining Table",
        woodType: "Oak Wood",
        price: "F85,000",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: 2,
        name: "Ergonomic Office Chair",
        woodType: "Walnut Wood",
        price: "F95,000",
      },
    ],
  },
  {
    id: 2,
    company_name: "WoodWorks Rwanda",
    company_location: "Huye, Rwanda",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_v5H5DBHuIl-dzqfFvIjSYvHSc7zVb_X8BA&s",
    products: [
      { id: 3, name: "Classic Bookshelf", woodType: "Pine Wood", price: "F125,000" },
      { id: 4, name: "Rustic Coffee Table", woodType: "Mahogany", price: "F75,000" },
    ],
  },
  {
    id: 3,
    company_name: "Green WoodWorks",
    company_location: "Musanze, Rwanda",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_v5H5DBHuIl-dzqfFvIjSYvHSc7zVb_X8BA&s",
    products: [
      { id: 5, name: "Vintage Wardrobe", woodType: "Cherry Wood", price: "F210,000" },
      { id: 6, name: "Sleek Coffee Table", woodType: "Teak Wood", price: "F95,000" },
    ],
  },
];

const VendorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Products");
  const vendor = dummyVendors.find((v) => v.id === Number(id));

  if (!vendor)
    return <div className="text-center mt-10 text-gray-700">Vendor not found</div>;

  const backgroundImage = vendor.products[0]?.image || vendor.image;

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      {/* ✅ Hero Section (No inline CSS) */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
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

      {/* ✅ Vendor Profile */}
      <div className="relative -mt-16 mx-auto w-11/12 max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={vendor.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-800">{vendor.company_name}</h2>
          <div className="flex justify-center sm:justify-start items-center gap-2 text-yellow-500 mt-1">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span className="font-medium text-gray-700">4.8</span>
            <span className="text-gray-500 text-sm">(124 reviews)</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{vendor.company_location}</p>
        </div>

        {/* ✅ Keep only the Message button */}
        <div className="flex gap-3 mt-3 sm:mt-0">
          <button className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-105 transition text-sm">
            <MessageSquare size={16} /> Message
          </button>
        </div>
      </div>

      {/* ✅ Tabs */}
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

      {/* ✅ Products Tab */}
      {activeTab === "Products" && (
        <div className="w-11/12 max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {vendor.products.map((p) => (
            <div
              key={p.id}
              className="border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="w-full h-80 bg-gray-100 overflow-hidden mb-3">
                <img
                  src={p.image || "https://via.placeholder.com/400x400"}
                  alt={p.name}
                  className="w-full h-80 object-cover rounded-t-lg hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="h-16 px-4 pb-4 flex-1 flex flex-col">
                <h3 className="text-gray-800 font-semibold text-base">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.woodType}</p>
                <p className="text-[#4B341C] font-semibold mt-1">{p.price}</p>
                <button className="mt-3 bg-[#4B341C] text-white w-full py-2 rounded-lg hover:bg-[#3a2917]/90 hover:scale-105 transition font-medium text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ About Tab */}
      {activeTab === "About" && (
        <div className="w-11/12 max-w-4xl mx-auto mt-6 text-gray-700 pb-10 leading-relaxed">
          <p>
            {vendor.company_name} specializes in handcrafted wooden furniture,
            designed with precision and attention to detail to enhance homes and
            offices across Rwanda.
          </p>
        </div>
      )}

      {/* ✅ Reviews Tab */}
      {activeTab === "Reviews" && (
        <div className="w-11/12 max-w-4xl mx-auto mt-6 text-gray-700 pb-10">
          <p>No reviews yet. Be the first to leave feedback!</p>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
