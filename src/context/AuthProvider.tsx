"use client"
import {ReactNode, useEffect, useState} from "react";
import {useRouter} from "next/navigation";


interface User {
    fullName: string;
    email?: string;
    password: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (identifier: string, password: string) => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string,
        fullName: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    refreshToken: () => Promise<void>;
    isLoading: boolean;
}

export default function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const login = async (identifier: string, password: string) => {

    }
}