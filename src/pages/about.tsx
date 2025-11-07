import React from "react";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
    return (
        <div className="font-sans bg-[#F5F5F5] text-[#4B341C] overflow-x-hidden">
            {/* 🌟 Hero Section */}
            <section
                className="relative h-[60vh] w-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url(/ph12.jpg)" }}
            >
                <div className="bg-black/50 w-full h-full flex items-center justify-center px-4">
                    <div className="text-center max-w-3xl text-white">
                        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                            About UmubajiHub
                        </h1>
                        <p className="mt-4 text-lg md:text-xl drop-shadow">
                            Connecting talented vendors with customers who value handmade furniture and craftsmanship.
                        </p>
                    </div>
                </div>
            </section>

            {/* 🪵 Our Mission */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-[4%] text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        At UmubajiHub, our mission is to empower local woodworking vendors and artisans by providing them with a platform to showcase their unique products, connect with customers, and grow their businesses. We aim to promote quality craftsmanship while making it easy for buyers to find custom, handmade furniture.
                    </p>
                </div>
            </section>

            {/* 👥 How It Works */}
            <section className="py-16 bg-[#FFF3EC]">
                <div className="max-w-7xl mx-auto px-[4%] text-center">
                    <h2 className="text-3xl font-bold mb-10">How UmubajiHub Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            img="/ph8.jpg"
                            title="For Vendors"
                            desc="Sign up to create your shop, list your handmade furniture, and reach customers across Rwanda."
                        />
                        <FeatureCard
                            img="/ph9.jpg"
                            title="For Customers"
                            desc="Browse products, discover talented vendors, and order quality, handmade furniture with ease."
                        />
                        <FeatureCard
                            img="/ph10.jpg"
                            title="Community Support"
                            desc="Join a community that values local craftsmanship, supports artisans, and promotes sustainable furniture practices."
                        />
                    </div>
                </div>
            </section>

            {/* 📦 Vendors Showcase */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-[4%]">
                    <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Vendors</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Master Woodworks", img: "/ph11.jpg", product: "Dining Table" },
                            { name: "Elite Furniture Co", img: "/ph12.jpg", product: "Office Chair" },
                            { name: "Rwanda Craft Studio", img: "/ph13.jpg", product: "Bookshelf" },
                            { name: "Kivu Woodworks", img: "/ph14.jpg", product: "Coffee Table" },
                        ].map((vendor, idx) => (
                            <div key={idx} className="bg-[#F5F5F5] rounded-lg shadow hover:shadow-lg transition overflow-hidden text-center">
                                <div className="h-48 overflow-hidden rounded-t-lg">
                                    <img src={vendor.img} alt={vendor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-[#4B341C]">{vendor.name}</h3>
                                    <p className="text-gray-600">{vendor.product}</p>
                                    <Link to="/explore">
                                        <button className="mt-3 px-4 py-2 bg-[#4B341C] text-white rounded-md text-sm hover:bg-[#3b2a15] transition">
                                            View Products
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✨ CTA Section */}
            <section className="py-20 text-center bg-[#FFF3EC]">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Join UmubajiHub Today
                    </h2>
                    <p className="text-base sm:text-lg max-w-xl mx-auto">
                        Whether you’re a vendor showcasing your handmade creations or a customer looking for quality furniture, UmubajiHub connects you with the best local artisans.
                    </p>
                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        <Link to="/signup">
                            <button className="bg-[#4B341C] text-white px-6 py-3 font-semibold text-base rounded-md shadow hover:bg-[#3b2a15] transition">
                                Join as a Vendor
                            </button>
                        </Link>
                        <Link to="/explore">
                            <button className="bg-white text-[#4B341C] px-6 py-3 font-medium rounded-md shadow hover:bg-[#eeeae6] transition">
                                Browse Products
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

// FeatureCard Component
const FeatureCard = ({
    img,
    title,
    desc,
}: {
    img: string;
    title: string;
    desc: string;
}) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <div className="h-48 overflow-hidden rounded-t-lg">
            <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 text-center">
            <h3 className="font-semibold text-lg text-[#4B341C]">{title}</h3>
            <p className="text-gray-600 mt-2">{desc}</p>
        </div>
    </div>
);

export default AboutUs;
