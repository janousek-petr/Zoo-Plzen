"use client";

import Authguard from "@/components/guard/Authguard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Authguard>
            <main>{children}</main>
        </Authguard>
    )
}