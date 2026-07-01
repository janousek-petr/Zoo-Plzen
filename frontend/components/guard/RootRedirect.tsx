"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function RootRedirect({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, activeProfile } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) return; // nepřihlášený vidí landing page normálně
        router.replace(activeProfile ? "/domov" : "/zvoleni-profilu");
    }, [isLoading, isAuthenticated, activeProfile]);

    return <>{children}</>;
}