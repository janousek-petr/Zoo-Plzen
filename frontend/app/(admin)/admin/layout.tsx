import Sidebar from "@/components/admin/Sidebar";
import AdminGuard from "@/components/guard/Adminguard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-auto bg-gray-50 min-w-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}