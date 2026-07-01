"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AppGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, activeProfile } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }
        if (!activeProfile) {
            router.replace("/zvoleni-profilu");
        }
    }, [isLoading, isAuthenticated, activeProfile]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    if (!isAuthenticated || !activeProfile) return null;

    return <>{children}</>;
}