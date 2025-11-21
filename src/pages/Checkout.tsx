import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Home,
    Plus,
    Pencil, 
    X
} from "lucide-react";

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

    const [billingInfo, setBillingInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("MTN");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const deliveryAddress = {
        type: "Home",
        tag: "Default",
        name: billingInfo.fullName || `${storedUser.firstname || "Guest"} ${storedUser.lastname || ""}`,
        phone: billingInfo.phone || storedUser.phone || "+250 --- ---",
        address: billingInfo.address || "12KG Main street, Kigali, Rwanda"
    };

    const handlePlaceOrder = async () => {
        if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone || !billingInfo.address) {
            alert("⚠️ Please fill in all required billing fields.");
            return;
        }

        if (!storedUser.id) {
            alert("⚠️ User not logged in. Please log in to place an order.");
            return;
        }

        if (cartItems.length === 0) {
            alert("⚠️ Your cart is empty.");
            return;
        }

        const orderData = {
            user_id: storedUser.id,
            full_name: billingInfo.fullName,
            email: billingInfo.email,
            phone: billingInfo.phone,
            shipping_address: billingInfo.address,
            payment_method: paymentMethod
        };

        try {
            setLoading(true);

            const response = await fetch("http://localhost:3000/api/orders/place", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to place order");
            }

            
            setPlacedOrderId(result.order.id);
            setShowPopup(true);
            clearCart?.();
            setBillingInfo({ fullName: "", email: "", phone: "", address: "" });
            setDeliveryInstructions("");
            setPaymentMethod("MTN");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f6f2] min-h-screen py-8 px-4 sm:px-6 lg:px-20 text-[#4B341C] relative">
            <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
            <p className="text-sm text-gray-500 mb-8">Complete your order in just a few steps</p>

            {/* Steps */}
            <div className="flex justify-center gap-10 mb-10">
                <Step icon={<MapPin className="w-5 h-5" />} label="Delivery" active />
                
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Delivery Info */}
                    <div className="bg-white rounded-md p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Delivery Address</h3>
                            <button className="flex items-center gap-1 text-sm text-[#4B341C] border px-2 py-1 rounded-md hover:opacity-75">
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        <div className="flex flex-col border border-[#FFB800] bg-[#fff7ee] rounded-md p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold flex items-center">
                                        <Home size={14} />
                                        <strong className="ml-1">{deliveryAddress.type}</strong>
                                    </span>
                                    <span className="text-xs bg-[#FFB800] text-white px-2 py-0.5 rounded-md">
                                        {deliveryAddress.tag}
                                    </span>
                                </div>
                                <Pencil size={14} />
                            </div>
                            <p className="text-sm font-medium">{deliveryAddress.name}</p>
                            <p className="text-sm text-gray-600">{deliveryAddress.phone}</p>
                            <p className="text-sm text-gray-600">{deliveryAddress.address}</p>
                        </div>
                    </div>

                    {/* Billing */}
                    <div className="bg-white p-4 shadow-sm rounded-md space-y-4">
                        <h3 className="font-semibold text-lg mb-2">Billing Information</h3>
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            value={billingInfo.fullName}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={billingInfo.email}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                        />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Phone Number"
                            value={billingInfo.phone}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                        />
                        <input
                            name="address"
                            placeholder="Delivery Address"
                            value={billingInfo.address}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                        />
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-4 rounded shadow-sm">
                        <label className="block text-sm font-medium mb-2">Payment Method</label>
                        <select
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            value={paymentMethod}
                            className="w-full border px-3 py-2 rounded text-sm"
                        >
                            <option value="MTN">MTN</option>
                            <option value="Airtel">Airtel</option>
                            <option value="PayPal">PayPal</option>
                        </select>
                    </div>

                    {/* Note */}
                    <div className="bg-white p-4 rounded">
                        <label className="text-sm font-medium block mb-2">Delivery Instructions (Optional)</label>
                        <textarea
                            placeholder="Leave note for delivery team..."
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="w-full border p-3 text-sm rounded resize-none"
                        ></textarea>
                    </div>

                    {/* Back */}
                    <button
                        onClick={() => navigate("/cart")}
                        className="text-sm text-gray-500 hover:underline flex items-center gap-1"
                    >
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-md shadow-sm sticky top-24">
                    <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span>
                                Subtotal ({cartItems.length} item{cartItems.length !== 1 && "s"})
                            </span>
                            <span>RWF {total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold text-[#4B341C]">
                            <span>Total</span>
                            <span>RWF {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-700 bg-[#fff6e0] p-4 border border-[#FFB800] rounded">
                         <strong className="font-medium">Estimated Delivery:</strong> Within 1-2 hours.
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={cartItems.length === 0 || loading}
                        className="w-full mt-6 bg-[#4B341C] hover:bg-[#3b2a15] text-white py-2 rounded flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? "Placing order..." : "Place Order"} <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            
            {showPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg text-center relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
                            onClick={() => setShowPopup(false)}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-[#4B341C] mb-2">
                             Order Placed
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Your order (ID #{placedOrderId}) has been successfully submitted.
                            <br />
                            Please complete your payment within <strong>2 hours</strong> or it will be cancelled.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                            <button
                                onClick={() => navigate("/customer/orders")}
                                className="w-full bg-[#FFD700] text-[#4B341C] py-2 rounded font-medium hover:bg-[#ffe272]"
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/payment", {
                                        state: {
                                            orderId: placedOrderId,
                                            amount: total,
                                        },
                                    });
                                }}
                                className="w-full bg-[#4B341C] text-white py-2 rounded font-medium hover:bg-[#3b2a15]"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Step = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
    <div className="flex flex-col items-center">
        <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${active ? "bg-[#4B341C] text-white border-[#4B341C]" : "border-gray-300 text-gray-400"
                }`}
        >
            {icon}
        </div>
        <span className={`mt-1 text-sm ${active ? "text-[#4B341C]" : "text-gray-400"}`}>{label}</span>
    </div>
);

export default Checkout;