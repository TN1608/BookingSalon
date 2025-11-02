"use client"
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getUserInfo} from "@/services/auth";
import {toast} from "sonner";

interface CardDetails {
    name?: string
    number?: string
    expiry?: string
    cvc?: string
    cardType?: string | null
}

interface User {
    fullName: string;
    email?: string;
    // card?: CardDetails;
}

interface AuthContextType {
    isAuthenticated: boolean;
    fetchUser: () => Promise<void>;
    currentUser: User | null;
    login: (token: string, remember?: boolean) => void;
    logout: () => void;
    showLogin: boolean;
    setShowLogin: (v: boolean) => void;
    // updateCard: (card: CardDetails) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // const [user, setUser] = useState<User | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const resp = await getUserInfo();
            return resp.data;
        } catch (err) {
            console.error('Error fetching user:', err);
            toast.error('Failed to fetch user');
        }
    }

    useEffect(() => {
       const token = localStorage.getItem('token');
       if(token) {
           fetchUser();
           // eslint-disable-next-line react-hooks/set-state-in-effect
           setIsAuthenticated(true);
       }else {
           setIsAuthenticated(false);
           setCurrentUser(null);
       }
    }, [])

    const login = async (token: string, remember?: boolean) => {
        try{
            const rememberMe = remember ?? false;
            localStorage.setItem("rememberMe", rememberMe.toString());
            localStorage.setItem("token", token);
            setIsAuthenticated(true);
            await fetchUser();
        }catch (err) {
            console.error('Error during login:', err);
            toast.error('Login failed');
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rememberMe");
        setIsAuthenticated(false);
        router.push("/");
    };

    // const updateCard = (card: CardDetails) => {
    //     try {
    //         const newUser: User = {
    //             ...(currentUser ?? {fullName: ""}),
    //             card: {
    //                 ...(currentUser?.card ?? {}),
    //                 ...card,
    //             },
    //         }
    //         const remember = localStorage.getItem("rememberMe") === "true"
    //         if (remember) {
    //             localStorage.setItem("user", JSON.stringify(newUser))
    //         } else {
    //             sessionStorage.setItem("user", JSON.stringify(newUser))
    //         }
    //         setCurrentUser(newUser)
    //     } catch (e) {
    //         // silent
    //     }
    // }

    return (
        <AuthContext.Provider value={{currentUser, login, logout, showLogin, setShowLogin, isAuthenticated, fetchUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}