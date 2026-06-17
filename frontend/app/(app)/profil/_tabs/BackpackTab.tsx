"use client";

import { useState } from "react";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";
import BackpackHero from "@/components/ui/BackpackHero";
import { useProfile } from "@/hooks/useProfile";

// ── Katalog položek — zatím statický, později z /api/store nebo /api/items ──
const avatarItems = [
  { id: 1, src: "/img/startpage-2.png", alt: "Lev"     },
  { id: 2, src: "/img/startpage-1.png", alt: "Gepard"  },
  { id: 3, src: "/img/startpage-3.png", alt: "Levhart" },
];

const accessoryItems = [
  { id: 1, src: "/img/accessories/accessory-1.png", alt: "Vrtulník čepice"},
];

const wallpaperItems = [
  { id: 1, src: "/img/photo/image-1.jpg", alt: "Vydra"    },
  { id: 2, src: "/img/photo/image-3.png", alt: "Krokodýl" },
  { id: 3, src: "/img/photo/image-2.jpg", alt: "Želva"    },
];

// Fotky jsou jen pro zobrazení, nelze je vybrat jako tapetu
const photoItems = wallpaperItems;

const WALLPAPER_FIRST_ROW = 6;

export default function BackpackTab() {
  const { profile, isSaving, update } = useProfile();

  const [accessoriesExpanded, setAccessoriesExpanded] = useState(false);
  const [avatarsExpanded,     setAvatarsExpanded]     = useState(false);
  const [wallpapersExpanded,  setWallpapersExpanded]  = useState(false);
  const [selectedPhoto,       setSelectedPhoto]       = useState<string | null>(null);

  const visibleAvatars     = avatarsExpanded     ? avatarItems     : avatarItems.slice(0, 10);
  const visibleAccessories = accessoriesExpanded ? accessoryItems  : accessoryItems.slice(0, 10);
  const visibleWallpapers  = wallpapersExpanded  ? wallpaperItems  : wallpaperItems.slice(0, WALLPAPER_FIRST_ROW);

  // URL aktuálně vybraných položek (z profilu)
  const selectedAvatarSrc    = profile?.avatar_url ?? avatarItems[0].src;
  const selectedAccessorySrc = profile?.accessory_url ?? accessoryItems[0].src;
  const selectedWallpaperSrc = profile?.wallpaper_url ?? wallpaperItems[0].src;

  if (!profile) return null;

  return (
    <div className="w-full">
      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed top-4 right-4 z-50 bg-amber-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg animate-pulse">
          Ukládám...
        </div>
      )}

      {/* HERO */}
      <BackpackHero
        wallpaper={selectedWallpaperSrc}
        avatar={selectedAvatarSrc}
        accessory={selectedAccessorySrc}
        level={profile.level}
        xp={profile.xp}
        xpMax={profile.level * 100 + 100}
      />

      {/* PROFILOVKY */}
      <SectionBlock title="Profilovky">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 py-2">
          {visibleAvatars.map((item) => (
            <button
              key={item.id}
              onClick={() => update({ avatar_url: item.src })}
              className={[
                "relative rounded-full overflow-hidden shadow-md transition-all duration-200 aspect-square w-full",
                selectedAvatarSrc === item.src
                  ? "ring-4 ring-amber-400 ring-offset-2 scale-105"
                  : "hover:scale-105 hover:shadow-lg",
              ].join(" ")}
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover rounded-full" />
            </button>
          ))}
        </div>
        {avatarItems.length > 10 && (
          <ExpandButton expanded={avatarsExpanded} onClick={() => setAvatarsExpanded((p) => !p)} />
        )}
      </SectionBlock>

      {/* DOPLŇKY */}
      <SectionBlock title="Doplňky">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 py-2">
          {visibleAccessories.map((item) => (
            <button
              key={item.id}
              onClick={() => update({ accessory_url: item.src })}
              className={[
                "relative transition-all duration-200 aspect-square w-full",
                selectedAccessorySrc === item.src
                  ? "scale-110 drop-shadow-xl"
                  : "opacity-75 hover:opacity-100 hover:scale-105",
              ].join(" ")}
            >
              <Image src={item.src} alt={item.alt} fill className="object-contain" />
            </button>
          ))}
        </div>
        {accessoryItems.length > 10 && (
          <ExpandButton expanded={accessoriesExpanded} onClick={() => setAccessoriesExpanded((p) => !p)} />
        )}
      </SectionBlock>

      {/* TAPETY */}
      <SectionBlock title="Tapety">
        <div className="mb-5">
          <StatCard label="Tapety" current={wallpaperItems.length} total={10} bgColor="cus-bg-beige" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {visibleWallpapers.map((item) => (
            <button
              key={item.id}
              onClick={() => update({ wallpaper_url: item.src })}
              className={[
                "relative rounded-md overflow-hidden transition-all duration-200 w-full",
                selectedWallpaperSrc === item.src
                  ? "ring-4 ring-amber-400 ring-offset-1 scale-[1.04] shadow-md"
                  : "hover:scale-[1.03] hover:shadow-sm",
              ].join(" ")}
              style={{ aspectRatio: "1440 / 924" }}
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
        {wallpaperItems.length > WALLPAPER_FIRST_ROW && (
          <ExpandButton expanded={wallpapersExpanded} onClick={() => setWallpapersExpanded((p) => !p)} />
        )}
      </SectionBlock>

      {/* FOTKY */}
      <SectionBlock title="Fotky">
        <div className="mb-5">
          <StatCard label="Fotky" current={131} total={150} bgColor="bg-green-700" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photoItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPhoto(item.src)}
              className="relative rounded-md overflow-hidden w-full aspect-[1440/924] hover:scale-[1.03] transition"
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      </SectionBlock>

      {/* LIGHTBOX */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
          >
            ✕
          </button>
          <div className="relative w-[90vw] h-[90vh]">
            <Image src={selectedPhoto} alt="preview" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sdílené komponenty ────────────────────────────────────────────────────────

function ExpandButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center w-full mt-4 gap-1 text-gray-700 hover:text-amber-700 transition-colors"
    >
      <span className="cus-font-impacted-2 uppercase tracking-widest text-4xl font-extrabold">
        {expanded ? "Skrýt" : "Zobrazit vše"}
      </span>
      <span
        className="text-xl inline-block transition-transform duration-300"
        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        ▼
      </span>
    </button>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-white py-8 px-6">
        <h2 className="text-amber-400 cus-font-impacted-2 uppercase text-center text-6xl tracking-widest">
          {title}
        </h2>
      </div>
      <div className="bg-[#c8bfb0] px-6 py-6">{children}</div>
    </div>
  );
}