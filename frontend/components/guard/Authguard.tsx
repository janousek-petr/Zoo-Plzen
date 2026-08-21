"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, isVerified } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    const isVerifyPage = pathname.includes("/overeni-emailu");

    useEffect(() => {
        if (isLoading) return;

        // Nepřihlášený uživatel -> Přihlášení
        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }

        // Neověřený uživatel na stránce profilu -> Přesměrovat na ověření
        if (!isVerified && !isVerifyPage) {
            router.replace("/overeni-emailu");
            return;
        }
    }, [isLoading, isAuthenticated, isVerified, isVerifyPage, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <main className="md:my-30 my-20 flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </main>
        );
    }

    if (!isVerified && !isVerifyPage) {
        return (
            <main className="md:my-30 my-20 flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Přesměrovávám...</p>
            </main>
        );
    }

    return <main className="md:my-30 my-20">{children}</main>;
}