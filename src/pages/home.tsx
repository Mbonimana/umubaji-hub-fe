import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  HeartIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';
import { getBaseUrl } from '../config/baseUrl'; 

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const heroImages = [
  { url: '/ph9.jpg', text: 'Connect with Skilled Carpenters' },
  { url: '/ph5.jpg', text: 'Modern Furniture Builds for Your Lifestyle' },
];

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    autoplay: true,
    infinite: true,
    autoplaySpeed: 5000,
    speed: 800,
    arrows: false,
    dots: false,
    fade: true,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/products/getProducts`);
        setProducts(res.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = showAll ? products : products.slice(0, 8);

  return (
    <div className="font-sans bg-[#F5F5F5] overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-[600px] text-white">
        <Slider {...sliderSettings}>
          {heroImages.map((item, idx) => (
            <div key={idx} className="h-[600px]">
              <div
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.url})` }}
              >
                <div className="h-full w-full bg-black/30 flex items-center justify-center">
                  <div className="max-w-7xl mx-auto px-[4%] text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg animate-fade-in">
                      {item.text}
                    </h2>
                    <p className="mt-4 text-lg max-w-xl mx-auto text-white/90 hidden sm:block">
                      Your destination for custom craftsmanship and handmade furniture.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Promotional Section */}
      <section className="bg-[#FFF3EC] py-16">
        <div className="max-w-7xl mx-auto px-[4%] flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2">
            <img
              src="/ph10.jpg"
              alt="Craftsman at work"
              className="rounded-lg w-full object-cover shadow-lg"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <p className="text-sm text-[#7C5C3D] mb-2 uppercase tracking-wide font-semibold">
              Transform Your Space with Custom Furniture from Local Artisans
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4B341C] mb-4">
              Elevate Your Living with Exceptional Craftsmanship
            </h2>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              From personalized dining tables to custom office shelving, our experts design with intention, precision, and heart.
            </p>
            <button className="bg-[#4B341C] text-white px-6 py-3 rounded-md hover:bg-[#5C4025] transition duration-300 font-medium shadow">
              Discover More
            </button>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-[4%]">
          <h2 className="text-xl font-semibold mb-6 text-[#4B341C]">
            Trending Products
          </h2>

          {loading ? (
            // Simple spinner in center
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-[#4B341C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {displayedProducts.map((product, idx) => (
                  <div
                    key={product.id || idx}
                    className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="overflow-hidden rounded-t-lg h-48">
                      <img
                        src={product.images && product.images.length > 0
                          ? product.images[0]
                          : '/ph12.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-2">
                      <h4 className="font-medium text-lg text-[#4B341C] truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {product.category}
                      </p>
                      <p className="text-green-600 text-base font-semibold mt-1">
                        RWF {product.price}
                      </p>

                      {/* Buttons */}
                      <div className="flex justify-between gap-2 mt-3 flex-nowrap">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-2 py-1 rounded-md transition">
                          <EyeIcon className="w-4 h-4" /> View
                        </button>

                        <button
                          className="flex-1 flex items-center justify-center gap-1 bg-[#4B341C] hover:bg-[#3b2a15] text-white text-sm px-2 py-1 rounded-md transition"
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: parseFloat(product.price),
                              vendor: "Default Vendor",
                              img: product.images?.[0] ?? "",
                              quantity: 1,
                            })
                          }
                        >
                          <ShoppingCartIcon className="w-4 h-4" /> Add
                        </button>

                        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm transition">
                          <HeartIcon className="w-4 h-4" /> Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!showAll && products.length > 8 && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-2 bg-[#4B341C] text-white rounded-md text-sm font-semibold hover:bg-[#3b2a15] transition"
                  >
                    View More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5F5F5] text-center py-16">
        <div className="max-w-7xl mx-auto px-[4%] space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4B341C]">
            Are You a Talented Carpenter or Furniture Maker?
          </h2>
          <p className="text-lg sm:text-xl text-[#4B341C] font-medium max-w-2xl mx-auto">
            Join <span className="font-bold">UmubajiHub</span> and grow your business.
          </p>
          <Link to="/Signup">
            <button className="inline-block bg-[#4B341C] text-[#F5F5F5] text-base sm:text-lg font-semibold px-6 py-3 rounded-md shadow hover:bg-[#3b2a15] transition duration-300">
              Become a Vendor
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
