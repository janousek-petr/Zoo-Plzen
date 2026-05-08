import QuickMenu from "@/components/admin/QuickMenu"

export const metadata = { title: "Quick menu – Admin" };

export default function AdminPage() {
  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-8">
        <h1 className="text-4xl cus-font-impacted uppercase">Rychlý výběr</h1>
      </header>
      <div className="p-6">
        <QuickMenu/>
      </div>
    </>
  );
}