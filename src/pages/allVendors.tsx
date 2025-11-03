import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
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
  company_email: string;
  phone: string;
  image?: string;
  products: Product[];
}
// :white_check_mark: Dummy vendors with products
const dummyVendors: Vendor[] = [
  {
    id: 1,
    company_name: "Master Crafts Ltd",
    company_location: "Kigali, Rwanda",
    company_email: "contact@mastercrafts.com",
    phone: "+250 788 123 456",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS_d3n2b819ECRjI5t_QJj6kk7Gz0HZZOlnA&s",
    products: [
      { id: 1, name: "Modern Dining Table", woodType: "Oak Wood", price: "F85,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
      { id: 2, name: "Ergonomic Office Chair", woodType: "Walnut Wood", price: "F95,000" },
    ],
  },
  {
    id: 2,
    company_name: "WoodWorks Rwanda",
    company_location: "Huye, Rwanda",
    company_email: "info@woodworksrw.com",
    phone: "+250 789 654 321",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_v5H5DBHuIl-dzqfFvIjSYvHSc7zVb_X8BA&s",
    products: [
      { id: 3, name: "Classic Bookshelf", woodType: "Pine Wood", price: "F125,000" },
      { id: 4, name: "Rustic Coffee Table", woodType: "Mahogany", price: "F75,000" },
    ],
  },
  {
    id: 3,
    company_name: "GreenWood Creations",
    company_location: "Musanze, Rwanda",
    company_email: "hello@greenwood.com",
    phone: "+250 780 000 555",
    image: "https://images.unsplash.com/photo-1602524200613-6b3b1fba3ef5?auto=format&fit=crop&w=600&q=80",
    products: [
      { id: 5, name: "Bed Frame Set", woodType: "Teak Wood", price: "F250,000" },
      { id: 6, name: "Side Cabinet", woodType: "Birch Wood", price: "F65,000" },
    ],
  },
  // Add more vendors similarly if needed
];
const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendors] = useState<Vendor[]>(dummyVendors);
  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      {/* Header */}
      <div
        className="relative w-full h-60 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1616628188467-8d1b6d29a60c?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-6xl font-bold">All Vendors</h1>
          <p className="text-3xl text-gray-200 mt-5">
            Discover all our trusted vendors
          </p>
        </div>
      </div>
      {/* Vendor Grid */}
      <div className="w-11/12 max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {vendors.length > 0 ? (
          vendors.map((v) => (
            <div
              key={v.id}
              className="bg-white shadow-sm hover:shadow-lg rounded-xl p-4 transition cursor-pointer flex flex-col"
            >
              <img
                src={v.image}
                alt={v.company_name}
                className="w-full h-52 object-cover rounded-lg"
              />
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {v.company_name}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center mt-1">
                    <MapPin size={14} className="mr-1 text-[#4B341C]" />
                    {v.company_location}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{v.company_email}</p>
                </div>
                <button
                  onClick={() => navigate(`/vendorPage/${v.id}`)}
                  className="w-full bg-[#4B341C] text-white mt-4 py-2 rounded-lg font-medium hover:bg-[#3A2917]/90 transition"
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