import React from 'react';
import {
    MapPinIcon,
    MagnifyingGlassIcon,
    StarIcon,
    ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';    

const Home: React.FC = () => {
    const { addToCart } = useCart();

    return (
        <div className="font-sans bg-[#F5F5F5]">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-[#fefcf9] to-[#f3ebe2] py-12 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
                    Find Expert Carpenters & Quality Furniture
                </h1>
                <p className="text-gray-600 mb-6">
                    Connect with skilled artisans and discover handcrafted furniture for your home
                </p>

                {/* 🔍 Search Bar */}
                <div className="max-w-md mx-auto flex items-center border rounded-lg overflow-hidden bg-white shadow-md">
                    <input
                        type="text"
                        placeholder="Search for carpenter or furniture..."
                        className="flex-grow px-4 py-2 outline-none"
                    />
                    <button className="bg-primary text-white px-4 py-2">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Category Buttons */}
                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                    {['Tables', 'Chairs', 'Custom Work', 'All Vendors'].map((label) => (
                        <button
                            key={label}
                            className="bg-white border border-gray-300 shadow-sm py-3 px-5 rounded-md hover:bg-[#4B341C] hover:text-white transition"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ⚪ White Background — Featured Vendors */}
            <section className="bg-white pt-16">
                <div className="bg-[#F5F5F5] py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-t-2xl p-6 shadow-lg">

                            {/* 🔸 Featured Vendors Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-primary">Featured Vendors</h2>
                                <button className="text-[#4B341C] underline text-sm">View All</button>
                            </div>

                            {/* Vendor Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                                {[
                                    {
                                        name: 'Master Crafts Ltd',
                                        location: 'Kigali, Rwanda',
                                        reviews: 124,
                                        price: 'RF100,000 - RF600,000',
                                        image: 'https://lirp.cdn-website.com/222dffe2/dms3rep/multi/opt/Advert-homeoffice-1920w.jpg',
                                    },
                                    {
                                        name: 'Woodwork Artisans',
                                        location: 'Kigali, Rwanda',
                                        reviews: 98,
                                        price: 'RF120,000 - RF700,000',
                                        image: 'https://i.ytimg.com/vi/h2rUYMbW3_I/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCzh_fNQc44W29tWYJoHptgNO4GnQ',
                                    },
                                    {
                                        name: 'Premium Furniture Co',
                                        location: 'Kigali, Rwanda',
                                        reviews: 65,
                                        price: 'RF170,000 - RF800,000',
                                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4z-zZntSAuKnSLgwcd7N986hAqDAwmq9XzA&s',
                                    },
                                ].map((vendor, i) => (
                                    <div
                                        key={i}
                                        className="w-full max-w-[320px] bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                                    >
                                        <img
                                            src={vendor.image}
                                            alt={vendor.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4 flex flex-col justify-between h-full">
                                            <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                                <MapPinIcon className="w-4 h-4 mr-1 text-accent" />
                                                {vendor.location}
                                            </p>
                                            <div className="mt-1 text-yellow-500 flex items-center">
                                                {[...Array(5)].map((_, idx) => (
                                                    <StarIcon key={idx} className="w-4 h-4 mr-0.5" />
                                                ))}
                                                <span className="ml-2 text-xs text-gray-600">({vendor.reviews})</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Price range: {vendor.price}
                                            </p>
                                            <button className="mt-3 bg-primary text-white px-4 py-2 rounded-md text-sm w-full">
                                                <Link to="/vendor/${v.id}">View Profile</Link>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ⚫ Trending Products Dark Section */}
            <section className="bg-[#F5F5F5] py-12 px-4 text-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#4B341C]">
                        Trending Products
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                        {[
                            { name: 'Modern Dining Table', material: 'Oak Wood', price: '₦85,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s' },
                            { name: 'Ergonomic Office Chair', material: 'Walnut Wood', price: '₦65,000', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s' },
                            {
                                name: 'Classic Bookshelf',
                                material: 'Pine Wood',
                                price: '₦25,000',
                                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s',
                            },
                            { name: 'Rustic Coffee Table', material: 'Mahogany', price: '₦75,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReHXEpc0BlvP4w98XP0nLbk2AYG_yNNPHW9g&s' },
                        ].map((product, idx) => (
                            <div
                                key={idx}
                                className="w-full max-w-[280px] bg-white text-black rounded-lg overflow-hidden shadow"
                            >
                                {product.img ? (
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-400">
                                        <ShoppingCartIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h4 className="font-medium text-lg">{product.name}</h4>
                                    <p className="text-sm text-gray-600">{product.material}</p>
                                    <p className="mt-1 font-semibold text-primary">{product.price}</p>

                                    {/*  Add to Cart Button */}
                                    <button
                                        onClick={() =>
                                            addToCart({
                                                id: `${product.name}-${idx}`,
                                                name: product.name,
                                                price: parseInt(product.price.replace(/[₦,]/g, '')),
                                                vendor: "Default Vendor",
                                                img: product.img ?? '',
                                                quantity: 1
                                            })
                                        }
                                        className="mt-4 bg-[#4B341C] text-white w-full py-2 text-sm rounded-md hover:bg-primary transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🟤 Call To Action — Become a Vendor */}
            <section className="bg-primary text-white text-center py-10 px-4">
                <p className="text-sm mb-2 font-medium">
                    Are You a Carpenter or Furniture Maker?
                </p>
                <p className="mb-4 max-w-xl mx-auto text-sm">
                    Join UbuojuHub today and connect with customers looking for quality craftsmanship
                </p>
                <button className="bg-[#4B341C] text-white py-2 px-6 rounded-md font-medium shadow hover:bg-[#4B341C] hover:text-white transition duration-300">
                    <Link to="/Signup">Become a Vendor</Link>
                </button>
            </section>
        </div>
    );
};

export default Home;