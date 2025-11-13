import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Notiflix from "notiflix";
import { useCart } from "../contexts/CartContext";
import { formatRWF } from "../utils/currency";

Notiflix.Notify.init({
    position: "right-top",
    timeout: 2500,
    clickToClose: true,
});

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 🔐 Redirect if not logged in
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            Notiflix.Notify.failure("You must be logged in to view your cart.");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="bg-[#F5F5F5] py-16 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-[#4B341C] mb-6">
                    Shopping Cart
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 🛍 Cart Items */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow space-y-6">
                        {cartItems.length === 0 ? (
                            <p className="text-sm text-gray-600">Your cart is currently empty.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b pb-4"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-lg text-[#4B341C]">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{item.vendor}</p>

                                        {/* Quantity Controls */}
                                        <div className="mt-2 flex items-center gap-3">
                                            <button
                                                className="px-2 py-1 text-[#4B341C] border border-gray-300 rounded"
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >
                                                −
                                            </button>
                                            <span className="text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="px-2 py-1 text-[#4B341C] border border-gray-300 rounded"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-green-600 font-semibold">
                                            {formatRWF(item.price * item.quantity)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatRWF(item.price)} each
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="mt-2 text-red-500 hover:text-red-600"
                                            title="Remove"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Continue Shopping (only show if there's something to shop) */}
                        {cartItems.length > 0 && (
                            <button
                                onClick={() => navigate("/")}
                                className="mt-6 w-full py-2 text-sm text-[#4B341C] border border-[#4B341C] rounded hover:bg-[#f0eae4] transition"
                            >
                                ← Continue Shopping
                            </button>
                        )}
                    </div>

                    {/* 💳 Summary */}
                    <div className="bg-white p-6 rounded-lg shadow space-y-6">
                        <h2 className="text-lg font-semibold text-[#4B341C]">
                            Order Summary
                        </h2>

                        <div className="text-sm text-gray-700 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatRWF(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between font-bold text-[#4B341C] text-base pt-2 border-t">
                                <span>Total</span>
                                <span>{formatRWF(total)}</span>
                            </div>
                        </div>

                        <button
                            disabled={cartItems.length === 0}
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-[#4B341C] text-white py-2 px-6 rounded-md hover:bg-[#3b2a15] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout →
                        </button>

                        {/* Promo Code */}
                        <div className="pt-4">
                            <label className="block text-sm mb-1 text-gray-700">
                                Have a Promo Code?
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l text-sm"
                                    placeholder="Enter code"
                                />
                                <button className="bg-gray-200 px-4 rounded-r text-sm hover:bg-gray-300 transition">
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Trust Msg */}
                        <div className="text-xs text-gray-500 space-y-1 pt-4">
                            <p>✅ Free Returns within 7 days</p>
                            <p>✅ Secure Payments - 100% protected</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;