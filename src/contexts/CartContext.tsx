import { createContext, useContext } from "react";
import type { CartContextProps } from "./CartProvider";


export const CartContext = createContext<CartContextProps | undefined>(undefined);


export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};