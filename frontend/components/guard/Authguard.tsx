"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, isVerified } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Detekce, zda se uživatel nachází na stránce ověření e-mailu
    const isVerifyPage = pathname.startsWith("/overeni-emailu");
    const verifyParam = searchParams.get("verify");

    useEffect(() => {
        if (isLoading) return;

        // 1. Nepřihlášený uživatel -> přesměrovat na přihlášení
        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }

        // 2. Neověřený uživatel na běžné chráněné stránce -> přesměrovat na ověření e-mailu
        if (!isVerified && !isVerifyPage && !verifyParam) {
            router.replace("/overeni-emailu");
            return;
        }

        // 3. Již ověřený uživatel na stránce ověření -> přesměrovat do aplikace
        if (isVerified && isVerifyPage) {
            router.replace("/zvoleni-profilu");
            return;
        }
    }, [isLoading, isAuthenticated, isVerified, isVerifyPage, router]);

    // Pokud načítáme stav autentizace
    if (isLoading) {
        return (
            <main className="md:my-30 my-20 flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </main>
        );
    }

    // Pokud uživatel není přihlášen (probíhá přesměrování na /prihlaseni)
    if (!isAuthenticated) return null;

    // Pokud neověřený uživatel zkouší jít na chráněnou stránku (probíhá přesměrování na /overeni-emailu)
    if (!isVerified && !isVerifyPage) return null;

    // Pokud již ověřený uživatel vstoupí na /overeni-emailu (probíhá přesměrování do aplikace)
    if (isVerified && isVerifyPage) return null;

    // Vykreslení obsahu pro:
    // - Neověřeného přihlášeného uživatele na stránce /overeni-emailu
    // - Ověřeného přihlášeného uživatele na jakékoliv jiné chráněné stránce
    return <main className="md:my-30 my-20">{children}</main>;
}