"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, activeProfile, isAuthenticated, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }
        if (user?.role !== "admin") {
            router.replace(activeProfile ? "/domov" : "/zvoleni-profilu");
        }
    }, [isLoading, isAuthenticated, user, activeProfile]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== "admin") return null;

    return <>{children}</>;
}