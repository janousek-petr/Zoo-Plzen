"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, isVerified, activeProfile } = useAuthContext();
    const router = useRouter();

    // Autentizace může být hotová dřív, než dorazí user
    const waitingForUser = isAuthenticated && !user;

    // Kam přihlášený patří
    const target = !isVerified
        ? "/overeni-emailu"
        : activeProfile
        ? "/domov"
        : "/zvoleni-profilu";

    useEffect(() => {
        if (isLoading || waitingForUser) return;

        // Přihlášený uživatel nemá být na veřejných stránkách
        if (isAuthenticated) {
            router.replace(target);
        }
    }, [isLoading, waitingForUser, isAuthenticated, target, router]);

    if (isLoading || waitingForUser) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    if (isAuthenticated) return null;

    return <>{children}</>;
}