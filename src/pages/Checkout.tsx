import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Home, Building2, Plus, Pencil } from "lucide-react";

const Checkout = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [selectedAddress, setSelectedAddress] = useState<number>(0);
    const [deliveryInstructions, setDeliveryInstructions] = useState("");

    const addresses = [
        {
            type: "Home",
            tag: "Default",
            name: "musa",
            phone: "+234 801 234 5678",
            address: "123 Main Street, Ikeja, Lagos, Lagos State",
        },
        {
            type: "Office",
            name: "musa",
            phone: "+234 802 345 6789",
            address: "45 Business Avenue, Victoria Island, Lagos, Lagos State",
        },
    ];

    const handleContinue = () => {
        
        navigate("/payment");
    };

    return (
        <div className="bg-[#f8f6f2] min-h-screen py-8 px-4 sm:px-6 lg:px-20 text-primary">
            <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
            <p className="text-sm text-gray-500 mb-8">Complete your order in just a few steps</p>

           
            <div className="flex justify-center items-center gap-10 mb-10">
                <Step icon={<MapPin className="w-5 h-5" />} label="Delivery" active />
                <Step icon={<Building2 className="w-5 h-5" />} label="Payment" />
                <Step icon={<Pencil className="w-5 h-5" />} label="Review" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               
                <div className="md:col-span-2 flex flex-col gap-6">
                    {/* Address Selection */}
                    <div className="bg-white rounded-md p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Delivery Address</h3>
                            <button className="flex items-center gap-1 text-sm text-primary border px-2 py-1 rounded-md hover:opacity-75">
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        <div className="space-y-4">
                            {addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col border rounded-md p-4 cursor-pointer ${selectedAddress === index
                                            ? "border-secondary bg-[#fff7ee]"
                                            : "border-gray-200"
                                        }`}
                                    onClick={() => setSelectedAddress(index)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold flex items-center space-x-1">
                                                {addr.type === "Home" ? <Home size={14} /> : <Building2 size={14} />}
                                                <strong className="ml-1">{addr.type}</strong>
                                            </span>
                                            {addr.tag && (
                                                <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded-md">
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

                   
                    <div className="bg-white p-4 shadow-sm rounded-md">
                        <label className="font-medium text-sm block mb-2">Delivery Instructions (Optional)</label>
                        <textarea
                            placeholder="Add any special delivery instructions..."
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="w-full h-24 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                        />
                    </div>

                    
                    <button
                        className="flex items-center gap-1 w-fit mt-2 text-sm font-medium text-gray-500 hover:underline"
                        onClick={() => navigate("/cart")}
                    >
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                </div>

                {/*  Right: Order Summary */}
                <div className="bg-white p-6 rounded-md shadow-sm sticky top-24 h-fit">
                    <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold text-secondary text-base">
                            <span>Total</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Delivery notice */}
                    <div className="bg-[#fff6e0] text-sm p-4 mt-4 rounded-md text-gray-700 border border-yellow-200">
                        📦 <strong className="font-medium">Estimated Delivery:</strong>
                        <br />
                        Your order will be delivered in 1–2 days depending on customization
                    </div>

                    {/* Continue */}
                    <button
                        onClick={handleContinue}
                        className="mt-6 w-full bg-secondary text-black font-medium py-2 rounded hover:bg-primary hover:text-white flex items-center justify-center gap-2 transition"
                    >
                        Continue to Payment <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Step component
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
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${active ? "bg-secondary text-white border-secondary" : "border-gray-300 text-gray-400"
                }`}
        >
            {icon}
        </div>
        <span
            className={`mt-1 text-sm ${active ? "text-primary" : "text-gray-400"
                }`}
        >
            {label}
        </span>
    </div>
);

export default Checkout;