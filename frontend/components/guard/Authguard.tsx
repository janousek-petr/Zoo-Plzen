"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

const APP_HOME = "/domov";

// Stránky v (auth), na které smí i uživatel s vybraným profilem
const ALLOWED_WITH_PROFILE = ["/zvoleni-profilu"];

export default function Authguard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, isVerified, activeProfile } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isVerifyPage = pathname?.startsWith("/overeni-emailu") ?? false;
    const verifyParam = searchParams.get("verify");

    const waitingForUser = isAuthenticated && !user;

    // Neověřený uživatel smí jen na stránku ověření (nebo s ?verify=...)
    const mustVerify = isAuthenticated && !isVerified && !isVerifyPage && !verifyParam;

    // Ověřený uživatel s profilem musí pryč z (auth), kromě povolených stránek.
    // Zahrnuje i /overeni-emailu, takže ověřený s profilem jde rovnou do aplikace.
    const isAllowedPage = ALLOWED_WITH_PROFILE.some((p) => pathname?.startsWith(p));
    const mustLeaveAuth = isVerified && !!activeProfile && !isAllowedPage;

    // Ověřený bez profilu nemá co dělat na stránce ověření
    const verifiedOnVerifyPage = isVerified && !activeProfile && isVerifyPage;

    useEffect(() => {
        if (isLoading || waitingForUser) return;

        if (!isAuthenticated) {
            router.replace("/prihlaseni");
            return;
        }
        if (mustVerify) {
            router.replace("/overeni-emailu");
            return;
        }
        if (mustLeaveAuth) {
            router.replace(APP_HOME);
            return;
        }
        if (verifiedOnVerifyPage) {
            router.replace("/zvoleni-profilu");
            return;
        }
    }, [
        isLoading,
        waitingForUser,
        isAuthenticated,
        mustVerify,
        mustLeaveAuth,
        verifiedOnVerifyPage,
        router,
    ]);

    if (isLoading || waitingForUser) {
        return (
            <main className="md:my-30 my-20 flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </main>
        );
    }

    if (!isAuthenticated) return null;
    if (mustVerify) return null;
    if (mustLeaveAuth) return null;
    if (verifiedOnVerifyPage) return null;

    return <main className="md:my-30 my-20">{children}</main>;
}