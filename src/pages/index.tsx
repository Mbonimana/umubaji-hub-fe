import React from "react";
import { Link } from "react-router-dom";
import {
    ShoppingCartIcon,
    EyeIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Typewriter } from "react-simple-typewriter";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Index: React.FC = () => {
    const heroImages = [
        "/img4.jpg",
        // "/img2.jpg",
        // "/img3.jpg",
    ];

    const sliderSettings = {
        autoplay: true,
        infinite: true,
        autoplaySpeed: 4000,
        speed: 1000,
        arrows: false,
        dots: false,
        fade: true,
    };

    return (
        <div className="font-sans bg-[#F5F5F5] text-[#4B341C] overflow-x-hidden">
            {/* 🌄 Hero Section */}
            <section className="relative h-[90vh] w-full overflow-hidden">
                <Slider {...sliderSettings}>
                    {heroImages.map((url, i) => (
                        <div key={i} className="relative h-[90vh]">
                            {/* Background image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${url})` }}
                            ></div>

                            {/* Overlay + content */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
                                <div className="max-w-3xl space-y-5 text-white">
                                    <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                                        <Typewriter
                                            words={[
                                                "Discover Talented Carpenters",
                                                "Order Handmade Furniture",
                                                "Support Local Woodworkers",
                                            ]}
                                            loop={Infinity}
                                            cursor
                                            cursorStyle="|"
                                            typeSpeed={65}
                                            deleteSpeed={45}
                                            delaySpeed={1400}
                                        />
                                    </h1>
                                    <p className="text-base md:text-lg opacity-90 drop-shadow">
                                        High quality, custom furniture from local artisans across Rwanda.
                                    </p>
                                    <div className="flex justify-center gap-4 pt-4">
                                        <Link to="/home">
                                            <button className="bg-[#4B341C] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#3b2a15] transition duration-300 shadow">
                                                🛒 Buy Now
                                            </button>
                                        </Link>
                                        <Link to="/explore">
                                            <button className="bg-white text-[#4B341C] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#eeeae6] transition shadow">
                                                Start Exploring
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            {/* 🚀 Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-[4%] text-center">
                    <h2 className="text-3xl font-bold mb-10">What You Can Do on UmubajiHub</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<EyeIcon className="w-10 h-10 mx-auto text-[#4B341C]" />}
                            title="Discover Vendors"
                            desc="Find and connect with expert carpenters and furniture designers."
                        />
                        <FeatureCard
                            icon={<ShoppingCartIcon className="w-10 h-10 mx-auto text-[#4B341C]" />}
                            title="Order Furniture"
                            desc="Customize and purchase handmade wooden furniture directly from makers."
                        />
                        <FeatureCard
                            icon={<UserGroupIcon className="w-10 h-10 mx-auto text-[#4B341C]" />}
                            title="Join as a Vendor"
                            desc="Showcase your woodworking skills and reach a larger audience."
                        />
                    </div>
                </div>
            </section>

            {/* 📷 Split Content Section */}
            <section className="bg-[#FFF3EC] py-16">
                <div className="max-w-7xl mx-auto px-[4%] flex flex-col-reverse lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2 space-y-4">
                        <p className="text-sm uppercase font-semibold text-[#7C5C3D] tracking-wide">
                            Trusted by Rwandan Handcrafters
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Real Furniture. Real People. Real Craft.
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            UmubajiHub connects you with the best local vendors making high-quality work from real wood, with love.
                        </p>
                        <Link to="/vendors">
                            <button className="bg-[#4B341C] text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-[#3b2a15] transition">
                                Meet the Makers
                            </button>
                        </Link>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <img
                            src="/img3.jpg"
                            alt="Artisan at work"
                            className="rounded-lg object-cover w-full shadow-lg max-h-[470px]"
                        />
                    </div>
                </div>
            </section>

            {/* ✨ CTA Footer Section */}
            <section className="py-20 text-center bg-[#F5F5F5] text-[#4B341C]">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Are You a Talented Furniture Maker or Woodworker?
                    </h2>
                    <p className="text-base sm:text-lg max-w-xl mx-auto">
                        Join UmubajiHub to promote your custom creations, reach new clients, and grow your brand online. It's free!
                    </p>
                    <Link to="/signup">
                        <button className="bg-[#4B341C] text-white px-6 py-3 font-semibold text-base rounded-md shadow hover:bg-[#3b2a15] transition">
                            Join Now — It’s Free!
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

// 📦 FeatureCard component
const FeatureCard = ({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) => (
    <div className="bg-[#F5F5F5] text-center rounded-lg p-6 shadow flex flex-col items-center">
        {icon}
        <h3 className="font-semibold text-lg mt-3 mb-2">{title}</h3>
        <p className="text-sm text-gray-700">{desc}</p>
    </div>
);

export default Index;
