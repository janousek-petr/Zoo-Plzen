"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

const MENU_ITEMS = [
  { label: "Domov", href: "/domov/" },
  { label: "Hry", href: "/hry/kontinenty" },
  { label: "Týdenní žebříček", href: "/zebricek/" },
  { label: "Tvoje výzvy", href: "vyzvy" },
  { label: "Obchod", href: "/obchod/" },
  { label: "Zoo Plzeň", href: "https://zooplzen.cz/" },
];

const RIGHT_ICON_HREF = "/profil";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { activeProfile, setActiveProfile } = useAuthContext();

  if (pathname.includes("/kviz/")) return null;

  const handleProfileLogout = () => {
    setMenuOpen(false);
    setActiveProfile(null);
    router.push('/zvoleni-profilu');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">

          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Otevřít menu"
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.25 shrink-0"
          >
            <span className={["block w-6 h-[2px] bg-gray-800 rounded-full transition-all duration-300 origin-center", menuOpen ? "rotate-45 translate-y-[7px]" : ""].join(" ")} />
            <span className={["block w-6 h-[2px] bg-gray-800 rounded-full transition-all duration-300", menuOpen ? "opacity-0 scale-x-0" : ""].join(" ")} />
            <span className={["block w-6 h-[2px] bg-gray-800 rounded-full transition-all duration-300 origin-center", menuOpen ? "-rotate-45 -translate-y-[7px]" : ""].join(" ")} />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="relative w-10 h-10">
              <Image src={"/img/logos/zoo-100-dark.png"} alt="Zoo Plzeň" fill className="object-fill" />
            </div>
          </Link>

          <Link href={RIGHT_ICON_HREF} className="w-10 h-10 shrink-0 flex items-center justify-center" aria-label="Profil">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    {activeProfile?.avatar_url ? (
                    <Image
                        src={activeProfile.avatar_url}
                        alt="Profil"
                        fill
                        className="object-cover"
                    />
                    ) : (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                </div>
            </Link>

        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>

            {/* Aktivní profil */}
            {activeProfile && (
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Přihlášen jako</p>
                <p className="font-black text-gray-800 text-lg">{activeProfile.nickname ?? activeProfile.first_name}</p>
              </div>
            )}

            <ul className="flex flex-col py-2">
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-gray-800 font-semibold hover:bg-gray-50 hover:text-amber-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {activeProfile && (
                <li className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleProfileLogout}
                    className="w-full text-left px-6 py-3 text-red-500 font-semibold hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Odhlásit profil
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="h-16" />
    </>
  );
}