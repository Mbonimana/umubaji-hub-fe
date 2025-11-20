
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center py-20 px-6">
            <h1 className="text-3xl font-bold text-green-600 mb-6">🎉 Payment Complete</h1>
            <p className="text-lg mb-4">Thanks for your order! It’s being processed.</p>
            <button
                onClick={() => navigate("/")}
                className="mt-4 border px-6 py-2 rounded text-sm hover:underline"
            >
                Back to Home
            </button>
        </div>
    );
};

export default OrderSuccess;