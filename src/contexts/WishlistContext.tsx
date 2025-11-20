
import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    img: string;
    material?: string;
}

interface WishlistContextProps {
    wishlist: WishlistItem[];
    addToWishlist: (product: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(
    undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

   
    useEffect(() => {
        const stored = localStorage.getItem("wishlist");
        if (stored) setWishlist(JSON.parse(stored));
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (item: WishlistItem) => {
        if (!wishlist.find(p => p.id === item.id)) {
            setWishlist([...wishlist, item]);
        }
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(wishlist.filter(item => item.id !== id));
    };

    const isWishlisted = (id: string) => {
        return wishlist.some((item) => item.id === id);
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("UseWishlist used outside provider");
    return context;
};