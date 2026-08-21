"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, isVerified } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Pokud je uživatel už přihlášený, pošleme ho z přihlašovacích stránek pryč
        if (isAuthenticated) {
            if (!isVerified) {
                router.replace("/overeni-emailu");
            } else {
                router.replace("/zvoleni-profilu");
            }
        }
    }, [isLoading, isAuthenticated, isVerified, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    if (isAuthenticated) return null;

    return <>{children}</>;
}