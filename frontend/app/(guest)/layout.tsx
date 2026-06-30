import GuestGuard from "@/components/guard/Guestguard";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <GuestGuard>
            <main className="md:my-30 my-20">
                {children}
            </main>
        </GuestGuard>
    );
}