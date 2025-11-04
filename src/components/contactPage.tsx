import React, { useState } from "react";
import { Mail, User, Phone, MessageSquare } from "lucide-react";
import Notiflix from "notiflix";

interface MessagingFormProps {
  vendorId: string;
  vendorName?: string;
}

const MessagingForm: React.FC<MessagingFormProps> = ({ vendorId, vendorName }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      Notiflix.Notify.failure("Please fill in all required fields.");
      return;
    }

    // Simulate sending message
    Notiflix.Loading.circle("Sending your message...");
    setTimeout(() => {
      Notiflix.Loading.remove();
      Notiflix.Notify.success(`Message sent to ${vendorName || `Vendor #${vendorId}`}!`);
      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f7f4] to-[#f0ece8] p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Contact {vendorName || `Vendor #${vendorId}`}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#4B341C]">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#4B341C]">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone (Optional)</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#4B341C]">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="+250 780 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
            <div className="flex items-start border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#4B341C]">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-2 mt-1" />
              <textarea
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 resize-none"
                rows={5}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#4B341C] text-white py-2 rounded-lg font-medium hover:bg-[#3a2917]/90 transition text-sm"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagingForm;
