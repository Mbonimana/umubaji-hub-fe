
import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { getBaseUrl } from "../config/baseUrl";
import axios from "axios";

import type { FC, ReactNode } from "react";
import type { CartItem } from "./CartContext";
import { useAuth } from "./AuthContext";

const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { user } = useAuth();

  
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Auto sync guest cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Sync guest cart to DB when user logs in
    useEffect(() => {
        const syncCartToDatabase = async () => {
            if (!user) return;

            const guestCart = localStorage.getItem("cart");
            if (!guestCart) return;

            const parsedCart: CartItem[] = JSON.parse(guestCart);

            try {
                // Send each item to DB
                for (const item of parsedCart) {
                    await axios.post(`${getBaseUrl()}/cart/add`, {
                        product_id: item.id,
                        quantity: item.quantity,
                    }, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                        },
                    });
                }

                
                localStorage.removeItem("cart");
            } catch (error) {
                console.error("❌ Failed to sync cart to DB:", error);
            }
        };

        syncCartToDatabase();
    }, [user]); // run once after login

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
                await axios.post(`${getBaseUrl()}/cart/add`, {
                    product_id: item.id,
                    quantity: 1,
                }, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                });

                console.log(`🛒 Added item to DB for user ${user.id}`);
            } catch (err) {
                console.error("❌ DB Cart add failed:", err);
            }
        }
    };

    const updateQuantity = (id: string, value: number) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + value } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;