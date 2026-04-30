"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Položky hamburger menu — doplň href dle svých routes ─────────────────────
const MENU_ITEMS = [
  { label: "Domov", href: "/domov/" },
  { label: "Hry", href: "/hry/" },
  { label: "Týdenní žebříček", href: "/zebricek/" },
  { label: "Tvoje výzvy", href: "vyzvy" },
  { label: "Obchod", href: "/obchod/" },
  { label: "Zoo Plzeň", href: "https://zooplzen.cz/" },
];

// ── Cesty k obrázkům — vlož své ──────────────────────────────────────────────
const LOGO_SRC        = "/img/icons/zoo-logo.png";       // střed — odkaz na homepage
const RIGHT_ICON_SRC  = "/img/icons/profile-button.png"; // vpravo — odkaz na profil
const RIGHT_ICON_HREF = "/profil";                        // kam odkazuje pravá ikona

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ── HLAVNÍ LIŠTA ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">

          {/* VLEVO — hamburger tlačítko */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Otevřít menu"
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] flex-shrink-0"
          >
            <span
              className={[
                "block w-6 h-[2px] bg-gray-800 rounded-full transition-all duration-300 origin-center",
                menuOpen ? "rotate-45 translate-y-[7px]" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-[2px] bg-gray-800 rounded-full transition-all duration-300",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-[2px] bg-gray-800 rounded-full transition-all duration-300 origin-center",
                menuOpen ? "-rotate-45 -translate-y-[7px]" : "",
              ].join(" ")}
            />
          </button>

          {/* STŘED — logo jako odkaz */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          >
            <div className="relative w-10 h-10">
              <Image
                src={"/img/logos/zoo-100-dark.png"}
                alt="Zoo Plzeň"
                fill
                className="object-fill"
              />
            </div>
          </Link>

          {/* VPRAVO — ikona profilu jako odkaz */}
          <Link
            href={RIGHT_ICON_HREF}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
            aria-label="Profil"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={"/img/startpage-1.png"}
                alt="Profil"
                fill
                className="object-cover"
              />
            </div>
          </Link>

        </div>
      </nav>

      {/* ── DROPDOWN MENU ─────────────────────────────────────────────── */}
      {/*
        Overlay — kliknutím mimo zavře menu.
        Umístěn pod navbar (top-16 = 64px = výška navbaru).
      */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-40"
          onClick={() => setMenuOpen(false)}
        >
          {/* Samotný dropdown panel — klik na něj menu nezavře */}
          <div
            className="absolute top-0 left-0 w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
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
            </ul>
          </div>
        </div>
      )}

      {/* Spacer — aby obsah stránky nezačínal pod fixním navbarem */}
      <div className="h-16" />
    </>
  );
}