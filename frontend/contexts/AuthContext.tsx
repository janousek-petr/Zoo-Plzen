"use client";

import {createContext, useContext, useState, useEffect, ReactNode} from "react";
import type {Profile, User} from "@/lib/types";
import authService from "@/lib/api/auth";
import axiosClient from "@/lib/axios";

interface AuthContextType {
    user: User | null;
    activeProfile: Profile | null;
    setActiveProfile: (profile: Profile | null) => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    isVerified: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<User | null>;
    clearLocalAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const refreshUser = async (): Promise<User | null> => {
        try {
            const response = await authService.getUser();
            setUser(response.data);
            return response.data;
        } catch {
            setUser(null);
            return null
        }
    };

    useEffect(() => {
        setMounted(true);
        const init = async () => {
            try {
                await refreshUser();
                const stored = sessionStorage.getItem('activeProfile');
                if (stored && stored !== "undefined") {
                    setActiveProfile(JSON.parse(stored));
                }
            } catch (err) {
                console.error("Chyba při inicializaci auth:", err);
            } finally {
                setIsLoading(false);
            }
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

    const clearLocalAuth = () => {
        localStorage.removeItem("token");

        // Odstraní výchozí Authorization hlavičku z Axiosu
        delete axiosClient.defaults.headers.common["Authorization"];

        setUser(null);
    }

    if (!mounted) {
        return (
            <AuthContext.Provider value={{
                user: null,
                activeProfile: null,
                setActiveProfile: handleSetActiveProfile,
                isLoading: true,
                isAuthenticated: false,
                isVerified: false,
                logout,
                refreshUser,
                clearLocalAuth,
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
            isVerified: Boolean(user?.email_verified_at),
            logout,
            refreshUser,
            clearLocalAuth,
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