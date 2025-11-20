import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
    LoaderCircle,
    ArrowLeft,
    ArrowRight,
    Smartphone,
} from "lucide-react";

// Response structure based on your backend
type PaymentResponse = {
    success: boolean;
    message?: string;
    result?: {
        reference?: string;
        status?: string;
        amount?: number;
        kind?: string;
    };
};

const Payment = () => {
    const [method, setMethod] = useState<"mtn" | "airtel" | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    const { cartItems } = useCart();

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handlePay = async () => {
        if (!method || phoneNumber.trim().length < 10) {
            alert("Please choose a payment method and enter a valid phone number (at least 10 digits).");
            return;
        }

        setProcessing(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/transactions/cashin`, // ✅ Send to updated backend path
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        number: phoneNumber,
                        amount: total,
                    }),
                }
            );

            const responseText = await response.text();
            let result: PaymentResponse;

            try {
                result = JSON.parse(responseText);
            } catch {
                console.error("❌ Invalid JSON from backend:", responseText);
                throw new Error("Backend did not return valid JSON.");
            }

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Payment failed.");
            }

            
            alert("📲 Payment initiated.\nPlease check your phone and confirm using your Mobile Money PIN.");

            
            navigate("/order-success");

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown payment error.";
            alert(`❌ Payment failed: ${msg}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-[#F8F6F2] py-8 px-6 lg:px-20 min-h-screen">
            <h1 className="text-2xl font-semibold mb-1">Payment</h1>
            <p className="text-sm text-gray-500 mb-6">Choose how you'd like to pay</p>

            {/* Payment Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
                <PaymentOption
                    label="MTN Mobile Money"
                    icon={<img src="/mtn.png" className="h-6" alt="MTN" />}
                    selected={method === "mtn"}
                    onSelect={() => setMethod("mtn")}
                />
                <PaymentOption
                    label="Airtel Money"
                    icon={<img src="/airtel.png" className="h-6" alt="Airtel" />}
                    selected={method === "airtel"}
                    onSelect={() => setMethod("airtel")}
                />
            </div>

            {/* Phone Number Input */}
            {method && (
                <div className="mt-6 bg-white rounded-md p-4 max-w-md shadow-sm">
                    <label className="block text-sm font-medium mb-2">
                        Enter {method?.toUpperCase()} Phone Number:
                    </label>
                    <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFB800]">
                        <Smartphone size={16} />
                        <input
                            type="tel"
                            className="flex-1 ml-2 outline-none text-sm"
                            placeholder="07XX..."
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Bottom Buttons */}
            <div className="flex justify-between items-center mt-8 max-w-3xl">
                <button
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:underline"
                    onClick={() => navigate("/checkout")}
                >
                    <ArrowLeft size={16} /> Back to Checkout
                </button>

                <button
                    onClick={handlePay}
                    disabled={processing}
                    className="flex items-center gap-2 bg-[#4B341C] text-white px-6 py-2 rounded hover:bg-[#3b2a15] transition shadow disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="animate-spin" /> Processing...
                        </>
                    ) : (
                        <>
                            Pay Now <ArrowRight />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const PaymentOption = ({
    label,
    icon,
    selected,
    onSelect,
}: {
    label: string;
    icon: React.ReactNode;
    selected: boolean;
    onSelect: () => void;
}) => (
    <div
        onClick={onSelect}
        className={`flex items-center gap-3 p-4 cursor-pointer border rounded-md ${selected
                ? "border-[#FFB800] bg-[#fff7ee]"
                : "border-gray-300 hover:border-[#FFB800]"
            }`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </div>
);

export default Payment;