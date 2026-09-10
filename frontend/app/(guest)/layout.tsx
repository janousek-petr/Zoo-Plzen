import GuestGuard from "@/components/guard/Guestguard";
import BrandLogo from "@/components/layout/BrandLogo";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <GuestGuard>
            {/* Hlavička s novým logem */}
            <div className="my-4 flex justify-center w-full">
                <BrandLogo href="/" />
            </div>
            <main className="md:my-30 my-20">
                {children}
            </main>
        </GuestGuard>
    );
}