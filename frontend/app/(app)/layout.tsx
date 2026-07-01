import Navbar from '@/components/layout/NavigationBar'
import AppGuard from '@/components/guard/Appguard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppGuard>
            <Navbar />
            <main>{children}</main>
        </AppGuard>
    );
}