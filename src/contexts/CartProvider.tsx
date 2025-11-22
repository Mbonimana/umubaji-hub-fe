import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { getBaseUrl } from "../config/baseUrl";
import axios from "axios";
import { useAuth } from "./AuthContext";

import type { FC, ReactNode } from "react";
import type { CartItem } from "./CartContext";

const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { user } = useAuth();

    // Load cart from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            setCartItems(JSON.parse(stored));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Sync guest cart to DB when user logs in
    useEffect(() => {
        const syncCartToDB = async () => {
            if (!user) return;

            const guest = localStorage.getItem("cart");
            if (!guest) return;

            const items: CartItem[] = JSON.parse(guest);

            try {
                for (const item of items) {
                    await axios.post(
                        `${getBaseUrl()}/cart/add`,
                        {
                            product_id: item.id,
                            quantity: item.quantity,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${user.access_token}`,
                            },
                        }
                    );
                }

                localStorage.removeItem("cart");
                setCartItems([]);
            } catch (err) {
                console.error(" Failed to sync guest cart to DB:", err);
            }
        };

        syncCartToDB();
    }, [user]);

    // Add item to cart
    const addToCart = async (item: CartItem) => {
        setCartItems((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });

        if (user) {
            try {
                await axios.post(
                    `${getBaseUrl()}/cart/add`,
                    {
                        product_id: item.id,
                        quantity: 1,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                        },
                    }
                );
            } catch (err) {
                console.error("❌ Failed to add to DB cart:", err);
            }
        }
    };

    // Update item quantity (+ or -)
    const updateQuantity = (id: string, value: number) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + value }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // Remove item from cart
    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Clear full cart
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
