"use client"
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";


interface User {
    fullName: string;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User, remember?: boolean) => void;
    logout: () => void;
    showLogin: boolean;
    setShowLogin: (v: boolean) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            setUser(null);
        }
    }, []);

    const login = (u: User, remember = false) => {
        try {
            if (remember) {
                localStorage.setItem("user", JSON.stringify(u));
                localStorage.setItem("rememberMe", "true");
                sessionStorage.removeItem("user");
            } else {
                sessionStorage.setItem("user", JSON.stringify(u));
                localStorage.removeItem("user");
                localStorage.removeItem("rememberMe");
            }
            setUser(u);
            setShowLogin(false);
        } catch (e) {
            // silent
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        sessionStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout, showLogin, setShowLogin}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}