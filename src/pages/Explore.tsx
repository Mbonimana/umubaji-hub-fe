import React, { useState } from "react";
import { ShoppingCartIcon, EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";

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
}

const Explore: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();

  const products: Product[] = [
    { id: 1, name: "Modern Dining Table", category: "Tables", location: "Kigali", material: "Oak Wood", price: 85000, img: "/ph1.jpg", vendor: "Master Woodworks", rating: 4.8 },
    { id: 2, name: "Ergonomic Office Chair", category: "Chairs", location: "Huye", material: "Walnut Wood", price: 65000, img: "/ph3.jpg", vendor: "Elite Furniture Co", rating: 4.7 },
    { id: 3, name: "Classic Bookshelf", category: "Shelves", location: "Musanze", material: "Pine Wood", price: 25000, img: "/photo4.jpg", vendor: "Rwanda Craft Studio", rating: 4.5 },
    { id: 4, name: "Rustic Coffee Table", category: "Tables", location: "Rubavu", material: "Mahogany", price: 75000, img: "/ph5.jpg", vendor: "Kivu Woodworks", rating: 4.6 },
    { id: 5, name: "Office Chair Pro", category: "Chairs", location: "Kigali", material: "Leather & Metal", price: 95000, img: "/ph7.jpg", vendor: "Crafted Works", rating: 4.9 },
    { id: 6, name: "Mini Office Desk", category: "Desks", location: "Huye", material: "Composite Wood", price: 45000, img: "/photo2.jpg", vendor: "WorkWell Studios", rating: 4.3 },
  ];

  const filtered = products
    .filter((p) => 
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p.category === category) &&
      (location === "All" || p.location === location) &&
      p.price <= maxPrice
    )
    .sort((a, b) => 
      sortBy === "Highest Rated" ? b.rating - a.rating : 
      sortBy === "Lowest Price" ? a.price - b.price : 
      sortBy === "Highest Price" ? b.price - a.price : 0
    );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <main className="max-w-7xl mx-auto px-[4%] py-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#4B341C]">Explore All Products</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-1/4">
            <div className="bg-white p-4 rounded-md shadow-sm sticky top-20">
              <h3 className="font-semibold mb-3 text-[#4B341C]">Filters</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-[#4B341C]">Category</label>
                  <select className="w-full border rounded-md p-2 mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>All</option><option>Tables</option><option>Chairs</option><option>Desks</option><option>Shelves</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#4B341C]">Location</label>
                  <select className="w-full border rounded-md p-2 mt-1" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option>All</option><option>Kigali</option><option>Huye</option><option>Musanze</option><option>Rubavu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#4B341C]">Price Range</label>
                  <input type="range" min="10000" max="100000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#4B341C]" />
                  <p className="text-gray-600 mt-1">RWF up to {maxPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block font-medium text-[#4B341C]">Sort By</label>
                  <select className="w-full border rounded-md p-2 mt-1" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option>Highest Rated</option><option>Lowest Price</option><option>Highest Price</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <section className="flex-1">
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border rounded-md p-2 mb-4" />

            {filtered.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <div key={product.id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={product.img} alt={product.name} className="h-48 w-full object-cover" />
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-semibold text-lg text-[#4B341C]">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.material}</p>
                      <p className="text-green-600 mt-1 font-semibold">RWF {product.price.toLocaleString()}</p>
                      {/* Buttons in a single horizontal line */}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => setSelectedProduct(product)} className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-md transition"><EyeIcon className="w-4 h-4" /> View</button>
                        <button onClick={() => addToCart({ id: product.id.toString(), name: product.name, price: product.price, vendor: product.vendor, img: product.img, quantity: 1 })} className="flex items-center gap-1 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-xs px-3 py-1 rounded-md transition"><ShoppingCartIcon className="w-4 h-4" /> Add</button>
                        <button className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition"><HeartIcon className="w-4 h-4" /> Wishlist</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full relative shadow-lg">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectedProduct(null)}>✖</button>
            <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-[#4B341C]">{selectedProduct.name}</h3>
            <p className="text-gray-600">{selectedProduct.material}</p>
            <p className="text-green-600 font-bold mt-2">RWF {selectedProduct.price.toLocaleString()}</p>
            <p className="text-gray-600 mt-2">Vendor: <span className="font-semibold">{selectedProduct.vendor}</span></p>
            <p className="text-gray-500">Location: {selectedProduct.location}</p>
            <button className="mt-4 bg-[#4B341C] text-white px-4 py-2 rounded-md w-full" onClick={() => { addToCart({ id: selectedProduct.id.toString(), name: selectedProduct.name, price: selectedProduct.price, vendor: selectedProduct.vendor, img: selectedProduct.img, quantity: 1 }); setSelectedProduct(null); }}>Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
