"use client";

import { useState } from "react";
import Image from "next/image";

const PAW  = "/img/icons/currency-icon.png";
const GOLD = "#BD9554";

// ── Typy ─────────────────────────────────────────────────────────────────────

interface ShopItem {
  id: number;
  src: string;
  alt: string;
  price: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const userPaws = 75;

const heroItem: ShopItem = {
  id:    0,
  src:   "/img/photo/image-3.png",
  alt:   "Hlavní nabídka",
  price: 50,
};

const weeklyItems: ShopItem[] = [
  { id: 1, src: "/img/startpage-2.png", alt: "Položka 1", price: 25 },
  { id: 2, src: "/img/startpage-1.png", alt: "Položka 2", price: 25 },
  { id: 3, src: "/img/startpage-3.png", alt: "Položka 3", price: 25 },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [activeItem, setActiveItem] = useState<ShopItem | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-10 gap-10">

      {/* Packy uživatele */}
      <div className="self-end">
        <PawPrice price={userPaws} />
      </div>

      {/* ── DŘEVĚNÝ RÁM — zmenšen na max-w-xl ──────────────────────── */}
      <div className="relative w-full max-w-xl">

        <Image
          src="/img/background/store-bg.png"
          alt="Dřevěný rám"
          width={900}
          height={720}
          className="w-full h-auto relative z-10 pointer-events-none select-none"
        />

        {/* Nápis OBCHOD */}
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span
            className="cus-font-impacted-2 uppercase text-white tracking-widest drop-shadow-lg"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
              textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
            }}
          >
            Obchod
          </span>
        </div>

        {/* Klikatelná oblast — produkt + badge */}
        <button
          onClick={() => setActiveItem(heroItem)}
          className="absolute z-20 group"
          style={{ top: "16%", left: "5%", right: "5%", bottom: "5%" }}
          aria-label="Otevřít detail produktu"
        >
          <div className="relative w-full h-full overflow-hidden group-hover:brightness-90 transition-all duration-200">
            <Image src={heroItem.src} alt={heroItem.alt} fill className="object-cover pt-5" />
          </div>
          <div className="absolute -bottom-5 -right-5 z-30">
            <PawPrice price={heroItem.price} size="lg" />
          </div>
        </button>

      </div>

      {/* ── Tvoje NABÍDKA ──────────────────────────────────────────── */}
      <section className="w-full max-w-3xl flex flex-col items-center gap-8">
        <h2
          className="cus-font-impacted-2 uppercase text-5xl tracking-widest"
          style={{ color: GOLD }}
        >
          Tvoje nabídka
        </h2>

        <div className="flex flex-row flex-wrap justify-center gap-10">
          {weeklyItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="relative group"
            >
              <div
                className="rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-200"
                style={{ width: 130, height: 130, position: "relative" }}
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-3 -right-3 z-10">
                <PawPrice price={item.price} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── MODAL — zobrazí se pro každou položku zvlášť ─────────────── */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="cus-font-impacted-2 uppercase text-3xl tracking-widest"
              style={{ color: GOLD }}
            >
              Chceš si to koupit?
            </h3>
            <p className="text-gray-600 text-lg mt-1">Určitě se to na tvém profilu bude lemovat ;)</p>
            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image src={activeItem.src} alt={activeItem.alt} fill className="object-contain" />
            </div>
            <PawPrice price={activeItem.price} size="lg" />
            <button
              onClick={() => setActiveItem(null)}
              className="mt-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full transition-colors"
            >
              Zavřít
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

// ── Cenový odznak — md (výchozí) nebo lg (hero + modal) ──────────────────────
function PawPrice({ price, size = "md" }: { price: number; size?: "md" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div className={`flex items-center gap-1.5 bg-red-600 text-white font-extrabold rounded-full shadow-lg ${isLg ? "px-5 py-3 text-2xl" : "px-4 py-2 text-lg"}`}>
      <div className={`relative flex-shrink-0 ${isLg ? "w-8 h-8" : "w-6 h-6"}`}>
        <Image src={PAW} alt="packa" fill className="object-contain" />
      </div>
      <span>{price}</span>
    </div>
  );
}