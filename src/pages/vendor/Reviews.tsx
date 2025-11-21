import { useEffect, useState } from "react";
import Sidebar from "../../components/vendorDashboard/Sidebar";
import Navbar from "../../components/vendorDashboard/Navbar";
import { getBaseUrl } from "../../config/baseUrl";
import axios from "axios";
import Notiflix from "notiflix";
import { Star } from "lucide-react";

interface Review {
  id: number;
  customer_firstname: string;
  customer_lastname: string;
  title: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const baseURL = getBaseUrl();

  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const vendorId = loggedUser?.id;

  // ⭐ SAME LOGIC AS VendorsPage
  const getRatingColor = (r: number) => {
    if (r <= 1) return "text-red-500 fill-red-500";
    if (r <= 3) return "text-yellow-400 fill-yellow-400";
    return "text-green-500 fill-green-500";
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!vendorId) return;

      try {
        const res = await axios.get(`${baseURL}/reviews/${vendorId}`);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
        Notiflix.Loading.remove();
      }
    };

    fetchReviews();
  }, [vendorId]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">
            Customer Reviews
          </h1>

          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-[#5a4632] rounded-full animate-spin"></div>
                </div>
              ) : reviews.length === 0 ? (
                <p className="p-4 text-gray-500">No reviews yet.</p>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Comment</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reviews.map((r, idx) => (
                      <tr
                        key={r.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]"}
                      >
                        <td className="px-4 py-3 text-gray-800">
                          {r.customer_firstname} {r.customer_lastname}
                        </td>

                        <td className="px-4 py-3 text-gray-800">{r.title}</td>

                        {/* ⭐⭐⭐⭐⭐ Stars with colors */}
                        <td className="px-4 py-3 text-gray-800">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < r.rating
                                    ? getRatingColor(r.rating)
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {r.comment}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
