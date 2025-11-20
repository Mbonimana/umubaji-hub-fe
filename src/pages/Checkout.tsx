

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
    Building2,
} from "lucide-react";

const Checkout = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    const [loading, setLoading] = useState(false);

    const [billingInfo, setBillingInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
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
        address: billingInfo.address || "12KG Main street, Kigali, Rwanda",
    };

    const handlePlaceOrder = async () => {
        if (
            !billingInfo.fullName ||
            !billingInfo.email ||
            !billingInfo.phone ||
            !billingInfo.address
        ) {
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
            payment_method: paymentMethod,
        };

        try {
            setLoading(true);

            const response = await fetch("http://localhost:3000/api/orders/place", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to place order");
            }

            const result = await response.json();
            alert(`✅ Order placed successfully!\nOrder ID: ${result.order.id}`);
            setBillingInfo({ fullName: "", email: "", phone: "", address: "" });
            setDeliveryInstructions("");
            setPaymentMethod("MTN");
            navigate("/");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f6f2] min-h-screen py-8 px-4 sm:px-6 lg:px-20 text-[#4B341C]">
            <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
            <p className="text-sm text-gray-500 mb-8">
                Complete your order in just a few steps
            </p>

            {/* Steps Indicator */}
            <div className="flex justify-center items-center gap-10 mb-10">
                <Step icon={<MapPin className="w-5 h-5" />} label="Delivery" active />
                <Step icon={<Building2 className="w-5 h-5" />} label="Payment" />
                <Step icon={<Pencil className="w-5 h-5" />} label="Review" />
            </div>

            {/* Checkout Layout */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Delivery Address */}
                    <div className="bg-white rounded-md p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Delivery Address</h3>
                            <button className="flex items-center gap-1 text-sm text-[#4B341C] border px-2 py-1 rounded-md hover:opacity-75">
                                <Plus size={16} />
                                Add New
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
                                <button>
                                    <Pencil size={14} />
                                </button>
                            </div>
                            <p className="text-sm font-medium">{deliveryAddress.name}</p>
                            <p className="text-sm text-gray-600">{deliveryAddress.phone}</p>
                            <p className="text-sm text-gray-600">{deliveryAddress.address}</p>
                        </div>
                    </div>

                    {/* Billing Information */}
                    <div className="bg-white p-4 shadow-sm rounded-md space-y-4">
                        <h3 className="font-semibold text-lg mb-2">Billing Information</h3>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={billingInfo.fullName}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={billingInfo.email}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={billingInfo.phone}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Delivery Address"
                            value={billingInfo.address}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded text-sm"
                            required
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-4 shadow-sm rounded-md">
                        <label className="font-medium text-sm block mb-2">
                            Payment Method
                        </label>
                        <select
                            name="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border px-3 py-2 rounded text-sm"
                        >
                            <option value="MTN">MTN</option>
                            <option value="Airtel">Airtel</option>
                            <option value="PayPal">PayPal</option>
                        </select>
                    </div>

                    {/* Optional Instructions */}
                    <div className="bg-white p-4 shadow-sm rounded-md">
                        <label className="font-medium text-sm block mb-2">
                            Delivery Instructions (Optional)
                        </label>
                        <textarea
                            placeholder="Add any special delivery instructions..."
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="w-full h-24 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB800] resize-none"
                        />
                    </div>

                    {/* Back Button */}
                    <button
                        className="flex items-center gap-1 w-fit mt-2 text-sm font-medium text-gray-500 hover:underline"
                        onClick={() => navigate("/cart")}
                    >
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-md shadow-sm sticky top-24 h-fit">
                    <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>
                                Subtotal ({cartItems.length} item{cartItems.length !== 1 && "s"})
                            </span>
                            <span>RWF {total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold text-[#4B341C] text-base">
                            <span>Total</span>
                            <span>RWF {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-[#fff6e0] text-sm p-4 mt-4 rounded-md text-gray-700 border border-[#FFB800]">
                        📦 <strong className="font-medium">Estimated Delivery:</strong> <br />
                        Your order will be delivered in 1–2 hours depending on customization.
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={cartItems.length === 0 || loading}
                        className="mt-6 w-full bg-[#4B341C] text-white font-medium py-2 rounded hover:bg-[#3b2a15] flex items-center justify-center gap-2 transition"
                    >
                        {loading ? "Placing Order..." : "Place Order"} <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Step = ({
    icon,
    label,
    active = false,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}) => (
    <div className="flex flex-col items-center">
        <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${active
                ? "bg-[#4B341C] text-white border-[#4B341C]"
                : "border-gray-300 text-gray-400"
                }`}
        >
            {icon}
        </div>
        <span className={`mt-1 text-sm ${active ? "text-[#4B341C]" : "text-gray-400"}`}>
            {label}
        </span>
    </div>
);

export default Checkout;