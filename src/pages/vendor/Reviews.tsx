import { useEffect, useState } from 'react';
import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';

interface Review {
  id: number;
  customer_firstname: string;
  customer_lastname: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('{{ _.base }}reviews/24');
        const data = await response.json();
        setReviews(data.reviews); // maps the reviews array from backend
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Reviews</h1>

          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <p className="p-4 text-gray-500">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="p-4 text-gray-500">No reviews yet.</p>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Review ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Comment</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r, idx) => (
                      <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                        <td className="px-4 py-3 font-medium text-gray-800">{r.id}</td>
                        <td className="px-4 py-3 text-gray-800">{`${r.customer_firstname} ${r.customer_lastname}`}</td>
                        <td className="px-4 py-3 text-gray-800">
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.comment}</td>
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
