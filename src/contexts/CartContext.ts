import { createContext, useContext } from "react";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    vendor: string;
    img: string;
};

export type CartContextProps = {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => Promise<void> | void;
    updateQuantity: (id: string, value: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
};

export const CartContext = createContext<CartContextProps>({
    cartItems: [],
    addToCart: async () => {},
    updateQuantity: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
});

export const useCart = () => useContext(CartContext);