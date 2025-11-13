import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex flex-col justify-center items-center  px-4">
      <div className="bg-white rounded-lg p-10 max-w-sm text-center">
        <AlertCircle className="mx-auto mb-4 w-16 h-10 text-primary" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please contact the administrator if you think this is a mistake.
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
