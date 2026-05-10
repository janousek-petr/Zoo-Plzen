"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Profile, User } from "@/lib/types";
import authService from "@/lib/api/auth";

interface AuthContextType {
    user: User | null;
    activeProfile: Profile | null;
    setActiveProfile: (profile: Profile | null) => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const refreshUser = async () => {
        try {
            const response = await authService.getUser();
            setUser(response.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        setMounted(true);
        const init = async () => {
            await refreshUser();
            const stored = sessionStorage.getItem('activeProfile');
            if (stored) setActiveProfile(JSON.parse(stored));
            setIsLoading(false);
        };
        init();
    }, []);

    const handleSetActiveProfile = (profile: Profile | null) => {
        setActiveProfile(profile);
        if (profile) {
            sessionStorage.setItem('activeProfile', JSON.stringify(profile));
        } else {
            sessionStorage.removeItem('activeProfile');
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        handleSetActiveProfile(null);
    };

    if (!mounted) {
        return (
            <AuthContext.Provider value={{
                user: null,
                activeProfile: null,
                setActiveProfile: handleSetActiveProfile,
                isLoading: true,
                isAuthenticated: false,
                logout,
                refreshUser,
            }}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            activeProfile,
            setActiveProfile: handleSetActiveProfile,
            isLoading,
            isAuthenticated: !!user,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext must be used within AuthProvider');
    return context;
}