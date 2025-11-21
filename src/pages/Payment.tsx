import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    LoaderCircle,
    Smartphone,
} from "lucide-react";

interface PaymentResponse {
    success: boolean;
    message?: string;
    data?: {
        reference?: string;
        amount?: number;
        status?: string;
    };
}

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderId, setOrderId] = useState<number | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [method, setMethod] = useState<"mtn" | "airtel" | null>(null);
    const [phone, setPhone] = useState("");
    const [processing, setProcessing] = useState(false);

   
    useEffect(() => {
        const storedOrder = location.state?.orderId || localStorage.getItem("lastOrderId");
        const storedAmount = location.state?.amount || localStorage.getItem("lastOrderAmount");

        if (storedOrder) setOrderId(parseInt(storedOrder));
        if (storedAmount) setAmount(parseFloat(storedAmount));
    }, [location.state]);

    const handlePay = async () => {
        if (!orderId || !method || !phone || phone.trim().length < 10) {
            alert("ℹ️ Please complete all payment fields.");
            return;
        }

        setProcessing(true);

        try {
            const response = await fetch("http://localhost:3000/api/payments/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    amount,
                    phone,
                    method,
                }),
            });

            const result: PaymentResponse = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Payment failed. Try again.");
            }

            alert(
                "📲 Payment initiated.\nCheck your phone and enter your Mobile Money PIN to confirm."
            );

            navigate("/order-success", {
                state: {
                    orderId,
                    reference: result?.data?.reference || "N/A",
                },
            });
        } catch (err: any) {
            alert(`❌ Error: ${err.message || "Unknown error"}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-[#F8F6F2] py-8 px-6 lg:px-20 min-h-screen">
            <h1 className="text-2xl font-semibold mb-1">Payment</h1>
            <p className="text-sm text-gray-500 mb-6">Choose your payment method</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
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

            {/* Phone Input */}
            {method && (
                <div className="mt-6 bg-white rounded-md p-4 shadow-sm max-w-md">
                    <label className="block text-sm font-medium mb-2">
                        Enter {method?.toUpperCase()} Number:
                    </label>
                    <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFB800]">
                        <Smartphone size={16} />
                        <input
                            type="tel"
                            className="flex-1 ml-2 outline-none text-sm"
                            placeholder="07XX..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between items-center mt-10 max-w-3xl">
                <button
                    className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
                    onClick={() => navigate("/checkout")}
                >
                    <ArrowLeft size={16} /> Back to Checkout
                </button>
                <button
                    onClick={handlePay}
                    disabled={!orderId || processing}
                    className="flex items-center gap-2 bg-[#4B341C] text-white px-6 py-2 rounded hover:bg-[#3b2a15] transition disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="animate-spin" size={18} />
                            Processing...
                        </>
                    ) : (
                        <>
                            Pay Now <ArrowRight size={16} />
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
        className={`flex items-center gap-3 p-4 cursor-pointer border rounded-md duration-150 ${selected
                ? "border-[#FFB800] bg-[#fff7ee]"
                : "border-gray-300 hover:border-[#FFB800] hover:bg-[#fffaf3]"
            }`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </div>
);

export default Payment;