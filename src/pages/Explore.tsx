import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


interface Vendor {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  minPrice: number;
  maxPrice: number;
  image: string;
  category: string;
}

const Explore: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState("Highest Rated");

  const navigate = useNavigate();

  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Master Crafts Ltd",
      location: "Lagos, Nigeria",
      rating: 4.9,
      reviews: 24,
      minPrice: 400000,
      maxPrice: 600000,
      image: "https://images.unsplash.com/photo-1602526218301-8f79a73a9c3a",
      category: "Furniture Makers",
    },
    {
      id: 2,
      name: "Woodwork Artisans",
      location: "Abuja, Nigeria",
      rating: 4.8,
      reviews: 21,
      minPrice: 350000,
      maxPrice: 500000,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      category: "Carpenters",
    },
    {
      id: 3,
      name: "Premium Furniture Co",
      location: "Port Harcourt, Nigeria",
      rating: 4.7,
      reviews: 19,
      minPrice: 400000,
      maxPrice: 700000,
      image: "https://images.unsplash.com/photo-1616628188591-8e5d07a9e3c5",
      category: "Furniture Makers",
    },
    {
      id: 4,
      name: "Classic Carpentry",
      location: "Lagos, Nigeria",
      rating: 4.6,
      reviews: 17,
      minPrice: 450000,
      maxPrice: 650000,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      category: "Carpenters",
    },
    {
      id: 5,
      name: "Elite Woodworks",
      location: "Enugu, Nigeria",
      rating: 4.5,
      reviews: 22,
      minPrice: 300000,
      maxPrice: 550000,
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      category: "Furniture Makers",
    },
    {
      id: 6,
      name: "Custom Craft Studio",
      location: "Kano, Nigeria",
      rating: 4.9,
      reviews: 26,
      minPrice: 400000,
      maxPrice: 800000,
      image: "https://images.unsplash.com/photo-1598300055083-203d5c73443d",
      category: "Carpenters",
    },
  ];

  // Filtering + Sorting logic
  const filtered = vendors
    .filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || v.category === category;
      const matchesLocation = location === "All" || v.location.includes(location);
      const matchesPrice = v.maxPrice <= maxPrice;
      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "Highest Rated") return b.rating - a.rating;
      if (sortBy === "Lowest Price") return a.minPrice - b.minPrice;
      if (sortBy === "Highest Price") return b.maxPrice - a.maxPrice;
      return 0;
    });

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">
          Discover skilled carpenters and furniture makers
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="md:w-1/4 bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-semibold mb-3">Filters</h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium">Category</label>
                <select
                  className="w-full border rounded-md p-2 mt-1"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All</option>
                  <option>Carpenters</option>
                  <option>Furniture Makers</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Location</label>
                <select
                  className="w-full border rounded-md p-2 mt-1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>All</option>
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                  <option>Kano</option>
                  <option>Enugu</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Price Range</label>
                <input
                  type="range"
                  min="100000"
                  max="1000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-gray-600 mt-1">
                  ₦ up to {maxPrice.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block font-medium">Sort By</label>
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
          </aside>

          {/* Vendor Cards */}
          <section className="flex-1">
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />

            {filtered.length === 0 ? (
              <p className="text-gray-500">No vendors found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={v.image}
                      alt={v.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{v.name}</h3>
                      <p className="text-sm text-gray-500">{v.location}</p>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                        <p>⭐ {v.rating} ({v.reviews})</p>
                        <p>
                          ₦{v.minPrice.toLocaleString()} - ₦{v.maxPrice.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/vendor/${v.id}`)}
                        className="w-full mt-3 bg-secondary text-white py-2 rounded-md hover:bg-primary"
                      >
                        View Profile
                      </button>
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
