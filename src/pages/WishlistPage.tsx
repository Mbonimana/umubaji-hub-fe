import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';

const WishlistPage: React.FC = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-semibold mb-6 text-[#4B341C]">
                Your Wishlist ({wishlist.length})
            </h1>

            {wishlist.length === 0 ? (
                <p>You haven't added anything to your wishlist yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-md shadow p-4 flex flex-col"
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <h3 className="text-lg font-semibold text-[#4B341C]">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.material}</p>
                            <p className="text-green-600 font-bold mt-1">RWF {item.price}</p>

                            <div className="mt-auto flex justify-between items-center gap-2 pt-4">
                                <button
                                    onClick={() =>
                                        addToCart({ ...item, quantity: 1, vendor: "Default Vendor" })
                                    }
                                    className="flex gap-1 items-center bg-[#4B341C] text-white px-3 py-1 rounded hover:bg-[#3b2a15] text-sm"
                                >
                                    <ShoppingCartIcon className="w-4 h-4" /> Add to Cart
                                </button>
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;