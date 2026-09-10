"use client";

import Authguard from "@/components/guard/Authguard";
import BrandLogo from "@/components/layout/BrandLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Authguard>
            {/* Hlavička s novým logem */}
            <div className="my-4 flex justify-center w-full">
                <BrandLogo href="/zvoleni-profilu" />
            </div>
            <main>{children}</main>
        </Authguard>
    )
}