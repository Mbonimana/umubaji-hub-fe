// src/pages/Cart.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { X } from "lucide-react";
import Notiflix from "notiflix";
import { formatRWF } from "../utils/currency"

// Initialize toast config
Notiflix.Notify.init({
    position: "right-top",
    timeout: 2500,
    clickToClose: true,
});

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    // ✅ Check login status before loading cart
    useEffect(() => {
        const user = localStorage.getItem("user");
        const vendor = localStorage.getItem("Vendor");

        if (!user && !vendor) {
            Notiflix.Notify.failure("You must be logged in to view your cart.");
            navigate("/login");
        }
    }, [navigate]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="bg-[#f8f8f8] py-10 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

                {/* 🛒 Cart Items */}
                <div className="lg:col-span-2 bg-white p-6 rounded-md shadow">
                    <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {cartItems.length} item{cartItems.length !== 1 && "s"} in your cart
                    </p>

                    {/* Empty cart message */}
                    {cartItems.length === 0 ? (
                        <p className="text-gray-600 text-sm">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between border-b py-4 gap-4 mb-2 items-center"
                            >
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.vendor}</p>

                                    <div className="flex items-center my-2">
                                        <button
                                            className="px-2 text-[#4B341C]"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            className="px-2 text-[#4B341C]"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            +
                                        </button>
                                        <span className="ml-4 text-xs text-green-600">In Stock</span>
                                    </div>

                                    <button className="text-xs text-blue-400">Move to Wishlist</button>
                                </div>

                                <div className="text-right">
                                    <p className="text-[#4B341C] font-bold">{formatRWF(item.price * item.quantity)}</p>
                                    <p className="text-xs text-gray-400">{formatRWF(item.price)} each</p>
                                </div>

                                <button onClick={() => removeFromCart(item.id)}>
                                    <X className="w-4 h-4 text-[#4B341C]" />
                                </button>
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => navigate("/")}
                        className="w-full mt-6 py-2 border rounded-lg text-sm hover:bg-gray-100"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* 💳 Summary */}
                <div className="bg-white p-6 rounded-md shadow space-y-6">
                    <h3 className="text-lg font-semibold">Order Summary</h3>

                    <div className="flex justify-between border-b pb-2">
                        <span>Subtotal</span>
                        <span>{formatRWF(total)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600">FREE</span>
                    </div>

                    <div className="flex justify-between font-bold text-[#4B341C]">
                        <span>Total</span>
                        <span>{formatRWF(total)}</span>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="bg-[#4B341C] text-white py-2 px-6 rounded-md hover:bg-primary hover:text-white font-medium"
                    >
                        Proceed to Checkout →
                    </button>

                    {/* Promo Code */}
                    <div className="pt-4">
                        <label className="block mb-1 text-sm">Have a Promo Code?</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Enter code"
                                className="flex-grow px-3 py-2 border rounded-l text-sm"
                            />
                            <button className="bg-gray-200 px-4 rounded-r text-sm">Apply</button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500 space-y-1 pt-4">
                        <p>Free Returns within 7 days</p>
                        <p>Secure Payment - 100% secure</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;