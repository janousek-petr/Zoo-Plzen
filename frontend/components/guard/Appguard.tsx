"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AppGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, activeProfile, isVerified } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const isVerifyPage = pathname.startsWith("/overeni-emailu");

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }

        if (!isVerified && !isVerifyPage) {
            router.replace("/overeni-emailu");
            return;
        }

        if (isVerified && !activeProfile) {
            router.replace("/zvoleni-profilu");
            return;
        }

        if (isVerified && activeProfile && isVerifyPage) {
            router.replace("/domov");
            return;
        }
    }, [isLoading, isAuthenticated, isVerified, activeProfile, isVerifyPage, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    // Logika pro stránku /overeni-emailu uvnitř (app)
    if (isVerifyPage) {
        if (!isVerified) return <>{children}</>;

        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Přesměrovávám...</p>
            </div>
        );
    }

    if (!isVerified || !activeProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Přesměrovávám...</p>
            </div>
        );
    }

    return <>{children}</>;
}