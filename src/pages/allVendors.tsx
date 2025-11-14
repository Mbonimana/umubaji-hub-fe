import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { getBaseUrl } from "../config/baseUrl";

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
  company_email: string;
  company_location: string;
  image?: string;
  cover_image?: string;
  products?: Product[];
  rating?: number;
  reviews?: number;
}

const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MODAL STATES
  const [openModal, setOpenModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

  // REVIEW MODAL STATES
  const [reviews, setReviews] = useState<any[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const baseURL = getBaseUrl();
  const user_id = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/verified`);
        const vendorListRaw = response.data.users ?? [];

        // Map vendors with initial data
        const vendorList: Vendor[] = vendorListRaw.map((v: any) => ({
          id: v.id,
          company_name: v.company_name,
          company_email: v.email,
          company_location: v.company_location,
          image: v.company_logo || "",
          cover_image: v.company_cover_photo || "",
          products: v.products || [],
          rating: 0, // temporary, will be updated
          reviews: 0, // temporary, will be updated
        }));

        setVendors(vendorList);

        // Fetch reviews for each vendor
        await Promise.all(
          vendorList.map(async (v) => {
            try {
              const res = await axios.get(`${baseURL}/reviews/${v.id}`);
              const avg = parseFloat(res.data.average_rating);
              const totalReviews = res.data.total_reviews;

              setVendors((prev) =>
                prev.map((vendor) =>
                  vendor.id === v.id
                    ? { ...vendor, rating: avg, reviews: totalReviews }
                    : vendor
                )
              );
            } catch (err) {
              console.error(`Failed to fetch reviews for vendor ${v.id}`, err);
            }
          })
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load vendors.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Fetch reviews for a vendor (modal)
  const fetchVendorReviews = async (vendorId: number) => {
    try {
      const res = await axios.get(`${baseURL}/reviews/${vendorId}`);
      setReviews(res.data.reviews);
      setAverage(parseFloat(res.data.average_rating));
      setTotal(res.data.total_reviews);
    } catch (error) {
      console.error("Failed to load reviews", error);
    }
  };

  // Submit review
  const submitReview = async () => {
    if (!title || !comment || !rating) return alert("All fields are required");

    setLoadingReview(true);

    try {
      await axios.post(`${baseURL}/reviews/create-review`, {
        vendor_id: selectedVendor,
        user_id,
        title,
        rating,
        comment,
      });

      setTitle("");
      setComment("");
      setRating(5);

      await fetchVendorReviews(selectedVendor!);

      alert("Review submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }

    setLoadingReview(false);
  };

  return (
    <div>
      {/* Header */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">
            All Vendors
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-200 max-w-xl">
            Discover all our trusted vendors and their craftsmanship.
          </p>
        </div>
      </div>

      {/* Vendors */}
      <section className="max-w-7xl mx-auto px-[4%] py-16">
        <h2 className="text-xl font-semibold mb-8 text-[#4B341C]">
          Our Verified Vendors
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading vendors...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      v.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={v.company_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-semibold text-lg text-[#4B341C] truncate">
                      {v.company_name}
                    </h3>

                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin size={14} className="mr-1 text-[#4B341C]" />
                      {v.company_location}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14} // smaller stars
                          className={`mr-1 ${
                            v.reviews && i < Math.round(v.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}

                      {/* Show button for adding/seeing reviews */}
                      <button
                        onClick={() => {
                          setSelectedVendor(v.id);
                          fetchVendorReviews(v.id);
                          setOpenModal(true);
                        }}
                        className="ml-2 text-sm text-blue-600 underline"
                      >
                        {v.reviews && v.reviews > 0
                          ? `See reviews (${v.reviews})`
                          : "Add Review"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/vendorPage/${v.id}`, { state: { vendor: v } })
                    }
                    className="w-full mt-4 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-sm font-semibold py-2 rounded-md transition"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No vendors found.</p>
        )}
      </section>

      {/* REVIEW MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2">Vendor Reviews</h2>

            {/* Average */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`mr-1 ${
                    i < Math.round(average)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 font-semibold text-gray-700">
                {average.toFixed(1)} ({total})
              </span>
            </div>

            {/* Reviews List */}
            <div className="max-h-60 overflow-y-auto border p-3 rounded mb-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border-b py-2">
                    <p className="font-semibold">{r.title}</p>

                    <div className="flex">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm">{r.comment}</p>
                    <p className="text-xs text-gray-500">
                      by {r.customer_firstname} {r.customer_lastname}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review */}
            <h3 className="font-semibold mb-2">Write a Review</h3>

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border p-2 rounded mb-2"
              placeholder="Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Rating Selector */}
            <div className="flex items-center mb-3">
              <span className="mr-3">Rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={22}
                  onClick={() => setRating(s)}
                  className={`cursor-pointer ${
                    s <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={submitReview}
              disabled={loadingReview}
              className="w-full bg-[#4B341C] hover:bg-[#3b2a15] text-white py-2 rounded"
            >
              {loadingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
