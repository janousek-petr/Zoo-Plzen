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
            return null;
        }
    };

    useEffect(() => {
        setMounted(true);
        const init = async () => {
            try {
                const currentUser = await refreshUser();

                if (currentUser) {
                    const stored = sessionStorage.getItem("activeProfile");
                    if (stored && stored !== "undefined") {
                        try {
                            const parsed: Profile = JSON.parse(stored);
                            // Profil obnovíme jen, pokud patří přihlášenému uživateli
                            if (parsed.user_id === currentUser.id) {
                                setActiveProfile(parsed);
                            } else {
                                sessionStorage.removeItem("activeProfile");
                            }
                        } catch {
                            sessionStorage.removeItem("activeProfile");
                        }
                    }
                } else {
                    // Nikdo přihlášený -> žádný profil nesmí zůstat
                    sessionStorage.removeItem("activeProfile");
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
            sessionStorage.setItem("activeProfile", JSON.stringify(profile));
        } else {
            sessionStorage.removeItem("activeProfile");
        }
    };

    // Vyčistí úplně všechno lokální (token, hlavičku, uživatele i profil)
    const clearLocalAuth = () => {
        localStorage.removeItem("token");
        delete axiosClient.defaults.headers.common["Authorization"];
        sessionStorage.removeItem("activeProfile");
        setActiveProfile(null);
        setUser(null);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            // I když API selže, lokálně se odhlásíme
            console.error("Chyba při odhlášení:", err);
        } finally {
            clearLocalAuth();
        }
    };

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
            // Bez uživatele nikdy nevracíme profil
            activeProfile: user ? activeProfile : null,
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
    if (!context) throw new Error("useAuthContext must be used within AuthProvider");
    return context;
}