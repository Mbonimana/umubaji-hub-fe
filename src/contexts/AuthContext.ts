
import { createContext, useContext } from "react";

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    user_role: string;
    access_token: string;
};

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
});

export const useAuth = () => useContext(AuthContext);