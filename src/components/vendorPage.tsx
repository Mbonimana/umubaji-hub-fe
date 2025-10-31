// vendorPage.tsx
import React, { useState } from "react";
import { Star, MessageSquare, Phone } from "lucide-react";
import { useCart } from "../contexts/CartContext"; 

interface Product {
  id: number;
  name: string;
  woodType: string;
  price: string;
  image?: string;
}

const products: Product[] = [
  { id: 1, name: "Modern Dining Table", woodType: "Oak Wood", price: "F85,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Ergonomic Office Chair", woodType: "Walnut Wood", price: "F95,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Classic Bookshelf", woodType: "Pine Wood", price: "F125,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Rustic Coffee Table", woodType: "Mahogany", price: "F75,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Bed Frame Set", woodType: "Teak Wood", price: "F250,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Side Cabinet", woodType: "Birch Wood", price: "F65,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
];

const vendorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Products");
  const { addToCart } = useCart(); 

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">

      {/* Hero Banner */}
      <div
        className="relative w-full h-0 sm:h-72 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold">Master Crafts Ltd</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative -mt-16 mx-auto w-11/12 max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS_d3n2b819ECRjI5t_QJj6kk7Gz0HZZOlnA&s"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-800">Master Crafts Ltd</h2>
          <div className="flex justify-center sm:justify-start items-center gap-2 text-yellow-500">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span className="font-medium text-gray-700">4.8</span>
            <span className="text-gray-500 text-sm">(124 reviews)</span>
          </div>
          <p className="text-gray-600 text-sm">📍 Kigali, Rwanda</p>
          <p className="text-gray-600 text-sm">📞 +234 830 124 557</p>
          <p className="text-gray-600 text-sm">✉ contact@mastercrafts.com</p>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-3 mt-3 sm:mt-0">
          <button className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-105 transition text-sm">
            <MessageSquare size={16} />
            Message
          </button>
          <button className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 hover:scale-105 transition text-sm">
            <Phone size={16} />
            Contact
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-11/12 max-w-5xl mx-auto mt-6 flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
        {["Products", "About", "Reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium flex-shrink-0 transition-all ${activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === "Products" && (
        <div className="w-11/12 max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {products.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="w-full h-80 overflow-hidden mb-3 bg-gray-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-80 md:h-96 rounded-lg lg:h-[28rem] object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="h-16 px-4 pb-4 flex-1 flex flex-col">
                <h3 className="text-gray-800 font-semibold text-base">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.woodType}</p>
                <p className="text-primary font-semibold mt-1">{p.price}</p>

                {/* ✅ Add to Cart Button */}
                <button
                  onClick={() =>
                    addToCart({
                      id: `mastercraft-${p.id}`,
                      name: p.name,
                      price: parseInt(p.price.replace(/[F,]/g, '')), // clean F and comma
                      vendor: "Master Crafts Ltd",
                      img: p.image ?? '',
                      quantity: 1,
                    })
                  }
                  className="mt-3 bg-primary text-white w-full py-2 rounded-lg hover:bg-primary/90 hover:scale-105 transition font-medium text-sm"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* About Tab */}
      {activeTab === "About" && (
        <div className="w-11/12 max-w-4xl mx-auto mt-6 text-gray-700 pb-10 leading-relaxed">
          <p>
            Master Crafts Ltd specializes in handcrafted wooden furniture made from
            premium materials. Each piece reflects craftsmanship and attention to
            detail. We deliver nationwide and ensure customer satisfaction through
            our durable, aesthetic designs.
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

export default vendorPage;