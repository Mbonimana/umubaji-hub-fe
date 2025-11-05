import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  MessageSquare,
  Eye as EyeIcon,
  ShoppingCart as ShoppingCartIcon,
  Heart as HeartIcon,
} from "lucide-react";

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

// Dummy vendors + products
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
        price: "85,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
      {
        id: 2,
        name: "Ergonomic Office Chair",
        woodType: "Walnut Wood",
        price: "65,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
      {
        id: 3,
        name: "Classic Bookshelf",
        woodType: "Pine Wood",
        price: "25,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
      {
        id: 4,
        name: "Rustic Coffee Table",
        woodType: "Mahogany",
        price: "75,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
      {
        id: 5,
        name: "Office Chair Pro",
        woodType: "Leather & Metal",
        price: "95,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
      {
        id: 6,
        name: "Mini Office Desk",
        woodType: "Composite Wood",
        price: "45,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
    ],
  },
  {
    id: 2,
    company_name: "WoodWorks Rwanda",
    company_location: "Huye, Rwanda",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
    products: [
      {
        id: 7,
        name: "Small Coffee Table",
        woodType: "Bamboo & Rattan",
        price: "32,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
      {
        id: 8,
        name: "Expandable Bookshelf",
        woodType: "Engineered Wood",
        price: "68,000",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s",
      },
    ],
  },
];

const VendorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Products");

  const vendor = dummyVendors.find((v) => v.id === Number(id));

  if (!vendor) return <div className="text-center mt-10 text-gray-700">Vendor not found</div>;

  const backgroundImage = vendor.products[0]?.image || vendor.image;

  const addToCart = (item: any) => {
    console.log("🛒 Added to cart:", item);
  };

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

      {/* Vendor Profile Card */}
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
        <Link
          to={`/vendors/${vendor.id}/contact`}
          className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:text-white hover:bg-[#3a2917]/90 hover:scale-105 transition text-sm font-medium mt-4 sm:mt-0"
        >
          <MessageSquare size={16} />
          Message
        </Link>
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
                : "hover:bg-[#3a2917]/90 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Section */}
      {activeTab === "Products" && (
        <div className="py-16 bg-[#F5F5F5]">
          <div className="mx-auto w-11/12 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {vendor.products.map((product, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
                >
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-lg text-[#4B341C]">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.woodType}</p>
                    <p className="text-green-600 text-base font-semibold mt-1">
                      RWF {product.price}
                    </p>
                    <div className="flex flex-nowrap gap-1 mt-3">
                      <button className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-md transition">
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>
                      <button
                        className="flex items-center gap-1 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-xs px-3 py-1 rounded-md transition"
                        onClick={() =>
                          addToCart({
                            id: `${product.name}-${idx}`,
                            name: product.name,
                            price: parseInt(product.price.replace(/,/g, "")),
                            vendor: vendor.company_name,
                            img: product.image ?? "",
                            quantity: 1,
                          })
                        }
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        Add
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition">
                        <HeartIcon className="w-3 h-4" />
                        Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === "About" && (
        <div className="w-11/12 max-w-5xl mx-auto mt-6 text-gray-700 pb-10 leading-relaxed">
          <p>
            {vendor.company_name} specializes in handcrafted wooden furniture,
            designed with precision and attention to detail to enhance homes and
            offices across Rwanda.
          </p>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "Reviews" && (
        <div className="w-11/12 max-w-5xl mx-auto mt-6 text-gray-700 pb-10">
          <p>No reviews yet. Be the first to leave feedback!</p>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
