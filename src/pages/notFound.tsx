// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center  px-4">
      <div className="bg-white rounded-lg p-10 max-w-sm text-center">
        <AlertCircle className="mx-auto mb-4 w-16 h-10 text-primary" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist. Please check the URL or return to the homepage.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
