"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AppGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, isVerified, activeProfile } = useAuthContext();
    const router = useRouter();

    const isAdmin = user?.role === "admin";
    const waitingForUser = isAuthenticated && !user;

    useEffect(() => {
        if (isLoading || waitingForUser) return;

        // 1. Nepřihlášený -> přihlášení
        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }

        // 2. Neověřený e-mail -> ověření
        if (!isVerified) {
            router.replace("/overeni-emailu");
            return;
        }

        // 3. Admin je výjimka, profil nepotřebuje
        if (isAdmin) return;

        // 4. Bez vybraného profilu -> výběr profilu
        if (!activeProfile) {
            router.replace("/zvoleni-profilu");
        }
    }, [isLoading, waitingForUser, isAuthenticated, isVerified, isAdmin, activeProfile, router]);

    if (isLoading || waitingForUser) return null;
    if (!isAuthenticated) return null;
    if (!isVerified) return null;
    if (!isAdmin && !activeProfile) return null;

    return <>{children}</>;
}