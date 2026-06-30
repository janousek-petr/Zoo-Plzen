"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated) {
            router.replace("/zvoleni-profilu");
        }
    }, [isLoading, isAuthenticated]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    if (isAuthenticated) return null;

    return <>{children}</>;
}