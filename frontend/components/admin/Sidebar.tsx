"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiLayoutGridFill, RiLayoutGridLine, RiUserLine, RiFileTextLine, RiLogoutBoxLine, RiImageLine, RiGiftLine } from "react-icons/ri";

const NAV_ITEMS = [
  { label: "Kvízy", href: "/admin/quizzes", icon: RiLayoutGridLine },
  { label: "Uživatelé", href: "/admin/users", icon: RiUserLine },
  { label: "Média", href: "/admin/media", icon: RiImageLine },
  { label: "Předměty", href: "/admin/items", icon: RiGiftLine },
  { label: "Texty", href: "/admin/texts", icon: RiFileTextLine }
];

interface SidebarProps {
  onNavigate?: (title: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex md:w-60 w-40 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-gray-200 px-4 py-4">
        <Link href="/admin">
            <RiLayoutGridFill size={40} className="text-white bg-green-700 px-1 rounded-md hover:bg-green-800"/>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => onNavigate?.(label)}
              className={[
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-lg transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              ].join(" ")}
            >
              <Icon className={`text-base ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer – user */}
      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[11px] font-medium text-gray-600 select-none">
            JN
          </div>
          <span className="text-xs text-gray-500">Jiří N.</span>
        </div>
        <button
          className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="Odhlásit se"
        >
          <RiLogoutBoxLine className="text-lg" />
        </button>
      </div>
    </aside>
  );
}