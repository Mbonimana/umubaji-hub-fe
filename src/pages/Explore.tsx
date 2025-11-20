// Explore.tsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCartIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { getBaseUrl } from "../config/baseUrl";
import { MapPin, Tag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  location: string;
  material: string;
  price: number;
  img: string;
  vendor: string;
  rating: number;
  vendor_id: number;
}

const Explore: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const Baseurl = getBaseUrl();
        const res = await fetch(`${Baseurl}/products/getproducts`);
        const data = await res.json();

        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || "Unknown",
          location: p.company_location || "Unknown",
          material: p.description || "No description available",
          price: Number(p.price),
          img: p.images?.[0] || "/placeholder.jpg",
          vendor: p.company_name,
          vendor_id: p.user_id,
          rating: Math.floor(Math.random() * 5) + 1,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category) &&
        (location === "All" || p.location === location) &&
        p.price <= maxPrice
    )
    .sort((a, b) =>
      sortBy === "Highest Rated"
        ? b.rating - a.rating
        : sortBy === "Lowest Price"
          ? a.price - b.price
          : sortBy === "Highest Price"
            ? b.price - a.price
            : 0
    );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <main className="max-w-7xl mx-auto px-[4%] py-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#4B341C]">
          Explore All Products
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="md:w-1/4">
            <div className="bg-white p-4 rounded-md shadow-sm sticky top-20">
              <h3 className="font-semibold mb-3 text-[#4B341C]">Filters</h3>

              {/* Filters */}
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-[#4B341C]">Category</label>
                  <select
                    className="w-full border rounded-md p-2 mt-1"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>All</option>
                    <option>Libuyu</option>
                    <option>Timber</option>
                    <option>Home Furniture</option>
                    <option>Room Sofa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4B341C]">Location</label>
                  <select
                    className="w-full border rounded-md p-2 mt-1"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option>All</option>
                    <option>Kigali</option>
                    <option>Huye</option>
                    <option>Musanze</option>
                    <option>Rubavu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4B341C]">Price Range</label>
                  <input
                    type="range"
                    min="1"
                    max="10000000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#4B341C]"
                  />
                  <p className="text-gray-600 mt-1">RWF up to {maxPrice.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block font-medium text-[#4B341C]">Sort By</label>
                  <select
                    className="w-full border rounded-md p-2 mt-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Highest Rated</option>
                    <option>Lowest Price</option>
                    <option>Highest Price</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT LIST */}
          <section className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />

            {filtered.length === 0 ? (
              <p className="text-gray-500">Loading . . .</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow w-full h-[350px] flex flex-col"
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="h-40 w-full object-cover"
                    />

                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-semibold text-lg text-[#4B341C] truncate">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Tag size={15} className="text-gray-400" />
                        {product.category}
                      </p>

                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin size={15} className="text-gray-400" />
                        {product.location}
                      </p>

                      <p className="text-green-600 font-bold mt-2">
                        RWF {product.price.toLocaleString()}
                      </p>

                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-md transition"
                        >
                          <EyeIcon className="w-4 h-4" /> View
                        </button>

                        <button
                          onClick={() =>
                            addToCart({
                              id: product.id.toString(),
                              name: product.name,
                              price: product.price,
                              vendor: product.vendor,
                              img: product.img,
                              quantity: 1,
                            })
                          }
                          className="flex items-center gap-1 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-xs px-3 py-1 rounded-md transition"
                        >
                          <ShoppingCartIcon className="w-4 h-4" /> Add
                        </button>

                        <button
                          onClick={() => {
                            const wishlistItem = {
                              id: product.id.toString(),
                              name: product.name,
                              price: product.price,
                              img: product.img,
                              material: product.material
                            };

                            if (isWishlisted(product.id.toString())) {
                              removeFromWishlist(product.id.toString());
                            } else {
                              addToWishlist(wishlistItem);
                            }
                          }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md border text-xs transition ${isWishlisted(product.id.toString())
                              ? "border-red-600 text-red-600 bg-red-50"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <HeartIcon
                            className={`w-4 h-4 ${isWishlisted(product.id.toString())
                                ? "text-red-600 fill-red-600"
                                : ""
                              }`}
                          />
                          {isWishlisted(product.id.toString()) ? "Wishlisted" : "Wishlist"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Explore;