"use client";

import { Suspense } from "react";
import Authguard from "@/components/guard/Authguard";
import BrandLogo from "@/components/layout/BrandLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <Authguard>
                {/* Hlavička s logem */}
                <div className="my-4 flex justify-center w-full">
                    <BrandLogo href="/zvoleni-profilu" />
                </div>
                {children}
            </Authguard>
        </Suspense>
    );
}