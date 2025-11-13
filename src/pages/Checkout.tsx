import React, { useState} from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Home,
    Building2,
    Plus,
    Pencil,
} from "lucide-react";

const Checkout = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const [selectedAddress, setSelectedAddress] = useState<number>(0);
    const [deliveryInstructions, setDeliveryInstructions] = useState("");

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const addresses = [
        {
            type: "Home",
            tag: "Default",
            name: `${storedUser.firstname || "Guest"} ${storedUser.lastname || ""}`,
            phone: storedUser.phone || "+250 --- ---",
            address: "12KG Main street, Kigali, Rwanda",
        },
        {
            type: "Office",
            name: `${storedUser.firstname || "Guest"} ${storedUser.lastname || ""}`,
            phone: storedUser.phone || "+250 --- ---",
            address: "456 Business Ave, Kigali",
        },
    ];

    const handleContinue = () => {
        navigate("/payment");
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

            {/* Grid layout */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Content Section */}
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

                        <div className="space-y-4">
                            {addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col border rounded-md p-4 cursor-pointer ${selectedAddress === index
                                            ? "border-[#FFB800] bg-[#fff7ee]"
                                            : "border-gray-200"
                                        }`}
                                    onClick={() => setSelectedAddress(index)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold flex items-center space-x-1">
                                                {addr.type === "Home" ? (
                                                    <Home size={14} />
                                                ) : (
                                                    <Building2 size={14} />
                                                )}
                                                <strong className="ml-1">{addr.type}</strong>
                                            </span>
                                            {addr.tag && (
                                                <span className="text-xs bg-[#FFB800] text-white px-2 py-0.5 rounded-md">
                                                    {addr.tag}
                                                </span>
                                            )}
                                        </div>
                                        <button>
                                            <Pencil size={14} />
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium">{addr.name}</p>
                                    <p className="text-sm text-gray-600">{addr.phone}</p>
                                    <p className="text-sm text-gray-600">{addr.address}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Instructions */}
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

                    {/* Back to Cart */}
                    <button
                        className="flex items-center gap-1 w-fit mt-2 text-sm font-medium text-gray-500 hover:underline"
                        onClick={() => navigate("/cart")}
                    >
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                </div>

                {/* Right Checkout Summary */}
                <div className="bg-white p-6 rounded-md shadow-sm sticky top-24 h-fit">
                    <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 && "s"})</span>
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

                    {/* Estimated Delivery */}
                    <div className="bg-[#fff6e0] text-sm p-4 mt-4 rounded-md text-gray-700 border border-[#FFB800]">
                        📦 <strong className="font-medium">Estimated Delivery:</strong> <br />
                        Your order will be delivered in 1–2 days depending on customization.
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        className="mt-6 w-full bg-[#4B341C] text-white font-medium py-2 rounded hover:bg-[#3b2a15] flex items-center justify-center gap-2 transition"
                    >
                        Continue to Payment <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Step Icon Component
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
        <span
            className={`mt-1 text-sm ${active ? "text-[#4B341C]" : "text-gray-400"
                }`}
        >
            {label}
        </span>
    </div>
);

export default Checkout;