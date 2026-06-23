"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { getStore, buyItem, type StoreOffer } from "@/lib/api/store";

const PAW  = "/img/icons/currency-icon.png";
const GOLD = "#BD9554";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveUrl = (path: string | null | undefined): string | null =>
    path ? (path.startsWith("http") ? path : `${apiBase}${path}`) : null;

// ─────────────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const { profile, refresh } = useProfile();

  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOffer, setActiveOffer] = useState<StoreOffer | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);
    getStore(profile.id)
      .then(setOffers)
      .catch(() => setError('Nepodařilo se načíst obchod.'))
      .finally(() => setLoading(false));
  }, [profile?.id]);

  if (!profile) return null;

  // Nejdražší položka jde do "hero" slotu, zbytek do gridu "Tvoje nabídka"
  const sorted = [...offers].sort((a, b) => b.item.price - a.item.price);
  const heroOffer = sorted[0];
  const gridOffers = sorted.slice(1);

  const handleBuy = async (offer: StoreOffer) => {
    if (!profile.id) return;
    setBuying(true);
    setError(null);
    try {
      await buyItem(profile.id, offer.item_id);
      setOffers(prev => prev.filter(o => o.id !== offer.id));
      await refresh(); // dotáhne aktuální profile.points
      setActiveOffer(null);
    } catch (err: any) {
      setError(err.response?.data?.errors?.item_id?.[0] ?? 'Nákup se nezdařil.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-10 gap-10">

      {/* Packy uživatele */}
      <div className="self-end">
        <PawPrice price={profile.points} />
      </div>

      {error && (
        <div className="fixed top-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Načítám obchod...</p>
      ) : !heroOffer ? (
        <p className="text-gray-400">Obchod je momentálně prázdný, vrať se zítra.</p>
      ) : (
        <>
          {/* ── DŘEVĚNÝ RÁM — hero položka ──────────────────────── */}
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
              onClick={() => setActiveOffer(heroOffer)}
              className="absolute z-20 group"
              style={{ top: "16%", left: "5%", right: "5%", bottom: "5%" }}
              aria-label="Otevřít detail produktu"
            >
              <div className="relative w-full h-full overflow-hidden group-hover:brightness-90 transition-all duration-200">
                <Image src={resolveUrl(heroOffer.item.image) ?? ''} alt={heroOffer.item.name} fill className="object-cover pt-5" />
              </div>
              <div className="absolute -bottom-5 -right-5 z-30">
                <PawPrice price={heroOffer.item.price} size="lg" />
              </div>
            </button>

          </div>

          {/* ── Tvoje NABÍDKA ──────────────────────────────────────────── */}
          {gridOffers.length > 0 && (
            <section className="w-full max-w-3xl flex flex-col items-center gap-8">
              <h2
                className="cus-font-impacted-2 uppercase text-5xl tracking-widest"
                style={{ color: GOLD }}
              >
                Tvoje nabídka
              </h2>

              <div className="flex flex-row flex-wrap justify-center gap-10">
                {gridOffers.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => setActiveOffer(offer)}
                    className="relative group"
                  >
                    <div
                      className="rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-200"
                      style={{ width: 130, height: 130, position: "relative" }}
                    >
                      <Image src={resolveUrl(offer.item.image) ?? ''} alt={offer.item.name} fill className="object-cover rounded-full" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 z-10">
                      <PawPrice price={offer.item.price} />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── MODAL — zobrazí se pro každou položku zvlášť ─────────────── */}
      {activeOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => !buying && setActiveOffer(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activeOffer.item.category?.name && (
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                {activeOffer.item.category.name}
              </span>
            )}
            <h3
              className="cus-font-impacted-2 uppercase text-3xl tracking-widest text-center"
              style={{ color: GOLD }}
            >
              {activeOffer.item.name}
            </h3>
            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image src={resolveUrl(activeOffer.item.image) ?? ''} alt={activeOffer.item.name} fill className="object-contain" />
            </div>
            {activeOffer.item.description && (
              <p className="text-gray-600 text-base text-center">{activeOffer.item.description}</p>
            )}
            <PawPrice price={activeOffer.item.price} size="lg" />

            {profile.points < activeOffer.item.price ? (
              <p className="text-red-500 font-bold">Nemáš dost pacek na tento nákup.</p>
            ) : (
              <button
                onClick={() => handleBuy(activeOffer)}
                disabled={buying}
                className="mt-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-full transition-colors disabled:opacity-50"
              >
                {buying ? 'Kupuji...' : 'Koupit'}
              </button>
            )}

            <button
              onClick={() => setActiveOffer(null)}
              disabled={buying}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full transition-colors disabled:opacity-50"
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
      <div className={`relative shrink-0 ${isLg ? "w-8 h-8" : "w-6 h-6"}`}>
        <Image src={PAW} alt="packa" fill className="object-contain" />
      </div>
      <span>{price}</span>
    </div>
  );
}