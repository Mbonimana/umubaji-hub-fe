import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, X } from "lucide-react";
import { getBaseUrl } from "../config/baseUrl";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  firstname?: string;
  lastname?: string;
  exp: number;
  user_role?: "customer" | "vendor" | "admin";
  [key: string]: any;
};

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const token = localStorage.getItem("jwtToken");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"MTN" | "AIRTEL" | "BANK" | "">("");
  const [editOpen, setEditOpen] = useState(false);

  const [editedUser, setEditedUser] = useState({
    firstname: storedUser.firstname || "",
    lastname: storedUser.lastname || "",
    phone: storedUser.phone || "",
    address: storedUser.address || "Kigali, Rwanda",
    deliveryInstructions: "",
  });

  const isTokenExpired = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  const handlePlaceOrder = async () => {
    if (!token || isTokenExpired(token)) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!paymentMethod) return alert("Please select a payment method.");
    if (cartItems.length === 0) return alert("Your cart is empty!");

    try {
      setLoading(true);

      const res = await fetch(`${getBaseUrl()}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          fullnames: `${editedUser.firstname} ${editedUser.lastname}`,
          phone: editedUser.phone,
          address: editedUser.address,
          instructions: editedUser.deliveryInstructions,
        }),
      });

      const result = await res.json();
      console.log("ORDER RESPONSE:", result);

      if (!res.ok) throw new Error(result.error || "Failed to place order");

      const lastOrder = result.orders[result.orders.length - 1];
      setPlacedOrderId(lastOrder.id);
      setShowPopup(true);

      clearCart?.();

      // update address info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          address: editedUser.address,
          phone: editedUser.phone,
        })
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f6f2] min-h-screen py-8 px-4 sm:px-6 lg:px-20 text-[#4B341C] relative">
      <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
      <p className="text-sm text-gray-500 mb-8">Complete your order in just a few steps</p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Delivery Address</h3>
              <Pencil className="cursor-pointer" onClick={() => setEditOpen(!editOpen)} />
            </div>

            {!editOpen ? (
              <div className="border border-[#FFB800] bg-[#fff7ee] rounded-md p-4">
                <p className="text-sm font-medium">
                  {editedUser.firstname} {editedUser.lastname}
                </p>
                <p className="text-sm text-gray-600">{editedUser.phone}</p>
                <p className="text-sm text-gray-600">{editedUser.address}</p>
                {editedUser.deliveryInstructions && (
                  <p className="text-sm text-gray-600 italic">
                    {editedUser.deliveryInstructions}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-2 border border-[#FFB800] bg-[#fff7ee] rounded-md p-4">
                <input
                  className="border p-2 rounded"
                  placeholder="First Name"
                  value={editedUser.firstname}
                  onChange={(e) => setEditedUser({ ...editedUser, firstname: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Last Name"
                  value={editedUser.lastname}
                  onChange={(e) => setEditedUser({ ...editedUser, lastname: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Phone"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Address"
                  value={editedUser.address}
                  onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                />
                <textarea
                  className="border p-2 rounded"
                  placeholder="Delivery Instructions (optional)"
                  value={editedUser.deliveryInstructions}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, deliveryInstructions: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 rounded shadow-sm">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="flex gap-4">
              {["MTN", "AIRTEL", "BANK"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 border rounded-md
                    ${paymentMethod === method ? "border-[#4B341C] bg-[#f8f6f2]" : "border-gray-300"}`}
                >
                  <input
                    type="radio"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method as any)}
                    className="accent-[#4B341C]"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* Back to Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="text-sm text-gray-500 hover:underline flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back to Cart
          </button>
        </div>

        {/* RIGHT: Summary */}
        <div className="bg-white p-6 rounded-md shadow-sm sticky top-24">
          <h4 className="text-lg font-semibold mb-4">Order Summary</h4>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({cartItems.length} item)</span>
              <span>RWF {total.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>RWF {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-[#4B341C] hover:bg-[#3b2a15] text-white py-2 rounded flex items-center justify-center"
          >
            {loading ? "Placing order..." : "Place Order"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* POPUP */}
     {showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative animate-scaleIn">
      
      {/* Close Button */}
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        <X size={22} />
      </button>

      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-[#4B341C]/10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#4B341C]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-[#4B341C]">
        Order Successfully Placed
      </h2>

     
      <p className="text-gray-600 mt-2">
        Your order <span className="font-semibold">#{placedOrderId}</span> has been created and is now being processed.
      </p>

      
      <div className="mt-8">
        <button
          onClick={() => navigate("/customer/orders")}
          className="w-full bg-[#4B341C] text-white py-2.5 rounded-lg font-medium hover:bg-[#3a2915] transition shadow-sm"
        >
          Track Your Order
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Checkout;
