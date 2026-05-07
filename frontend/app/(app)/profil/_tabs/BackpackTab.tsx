"use client";

import { useState } from "react";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";
import BackpackHero from "@/components/ui/BackpackHero";

// ── Simulace dat ─────────────────────────────────────────────────────────────

const avatarItems = [
  { id: 1, src: "/img/startpage-2.png", alt: "Lev"      },
  { id: 2, src: "/img/startpage-1.png", alt: "Gepard"   },
  { id: 3, src: "/img/startpage-3.png", alt: "Levhart"  },
  { id: 4, src: "/img/startpage-1.png", alt: "Hroch"    },
  { id: 5, src: "/img/startpage-1.png", alt: "Tygr"     },
  { id: 6, src: "/img/startpage-1.png", alt: "Žirafa"   },
  { id: 7, src: "/img/startpage-2.png", alt: "Medvěd"   },
  { id: 8, src: "/img/startpage-3.png", alt: "Vlk"      },
  { id: 9, src: "/img/startpage-3.png", alt: "Vlk"      },
  { id: 10, src: "/img/startpage-3.png", alt: "Vlk"      },
  { id: 11, src: "/img/startpage-3.png", alt: "Vlk"      },
  { id: 12, src: "/img/startpage-3.png", alt: "Vlk"      },
  { id: 13, src: "/img/startpage-3.png", alt: "Vlk"      },
];

const accessoryItems = [
  { id: 1, src: "/img/accessories/accessory-1.png", alt: "Vrtulník čepice"      },
  { id: 2, src: "/img/accessories/accessory-1.png", alt: "Pirátský klobouk"     },
  { id: 3, src: "/img/accessories/accessory-1.png", alt: "Pirátský klobouk 2"   },
  { id: 4, src: "/img/accessories/accessory-1.png", alt: "Vrtulník čepice 2"    },
  { id: 5, src: "/img/accessories/accessory-1.png", alt: "Korunka"              },
  { id: 6, src: "/img/accessories/accessory-1.png", alt: "Čarodějnický klobouk" },
];


const wallpaperItems = [
  { id: 1, src: "/img/photo/image-1.jpg", alt: "Vydra"    },
  { id: 2, src: "/img/photo/image-3.png", alt: "Krokodýl" },
  { id: 3, src: "/img/photo/image-2.jpg", alt: "Želva"    },
  { id: 4, src: "/img/photo/image-3.png", alt: "Lev"      },
  { id: 5, src: "/img/photo/image-1.jpg", alt: "Slon"     },
  { id: 6, src: "/img/photo/image-2.jpg", alt: "Žirafa"   },
  { id: 7, src: "/img/photo/image-3.png", alt: "Tygr"     },
  { id: 8, src: "/img/photo/image-1.jpg", alt: "Gepard"   },
  { id: 9, src: "/img/photo/image-2.jpg", alt: "Hroch"    },
];


// ── Kapacita první řádky podle breakpointu
// Tailwind breakpointy: sm=640, md=768, lg=1024, xl=1280
// Avatary/doplňky: 96px + 24px gap
// sm:  640px → floor(640 / 120) = 5
// md:  768px → floor(768 / 120) = 6
// lg: 1024px → floor(1024/ 120) = 8
// Používáme konzervativní hodnoty kvůli paddingu sekce (px-6 = 48px)
const FIRST_ROW_CAPACITY = {
  default: 3, // < 640px
  sm: 4,      // >= 640px
  md: 5,      // >= 768px
  lg: 6,      // >= 1024px
};

// ─────────────────────────────────────────────────────────────────────────────

export default function BackpackTab() {
  const [selectedAvatarId,    setSelectedAvatarId]    = useState<number>(1);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<number>(1);
  const [selectedWallpaperId, setSelectedWallpaperId] = useState<number>(1);
  const [accessoriesExpanded, setAccessoriesExpanded] = useState(false);
  const [avatarsExpanded,     setAvatarsExpanded]     = useState(false);
  const [wallpapersExpanded,  setWallpapersExpanded]  = useState(false);
  //logika fotek na konci stranky
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Tapety: 3 sloupce mobil → 4 tablet → 6 desktop, první řada
  const WALLPAPER_FIRST_ROW = 6; // odpovídá grid-cols-6 na lg

  const visibleAvatars     = avatarsExpanded     ? avatarItems     : avatarItems.slice(0, 10);
  const visibleAccessories = accessoriesExpanded ? accessoryItems  : accessoryItems.slice(0, 10);
  const visibleWallpapers  = wallpapersExpanded  ? wallpaperItems  : wallpaperItems.slice(0, WALLPAPER_FIRST_ROW);

  const hasMoreAvatars     = avatarItems.length     > 10;
  const hasMoreAccessories = accessoryItems.length  > 10;
  const hasMoreWallpapers  = wallpaperItems.length  > WALLPAPER_FIRST_ROW;

  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <BackpackHero
        wallpaper="/img/photo/image-3.png"
        avatar="/img/startpage-1.png"
        accessory="/img/accessories/accessory-1.png"
        level={12}
        xp={150}
        xpMax={240}
      />

      {/* ── PROFILOVÝ OBRÁZEK ────────────────────────────────────────── */}
      <SectionBlock title="Profilovky">
        {/* 
          grid místo flex — pevný počet sloupců podle breakpointu.
          Každý avatar je 96px, mezery 24px.
          Na lg se vejde 6 na řádku, na md 5, na sm 4, default 3.
        */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 py-2">
          {visibleAvatars.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedAvatarId(item.id)}
              className={[
                "relative rounded-full overflow-hidden shadow-md transition-all duration-200 aspect-square w-full",
                selectedAvatarId === item.id
                  ? "ring-4 ring-amber-400 ring-offset-2 scale-105"
                  : "hover:scale-105 hover:shadow-lg",
              ].join(" ")}
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover rounded-full" />
            </button>
          ))}
        </div>
        {hasMoreAvatars && (
          <ExpandButton
            expanded={avatarsExpanded}
            onClick={() => setAvatarsExpanded((p) => !p)}
          />
        )}
      </SectionBlock>

      {/* ── DOPLNĚK ──────────────────────────────────────────────────── */}
      <SectionBlock title="Doplňky">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 py-2">
          {visibleAccessories.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedAccessoryId(item.id)}
              className={[
                "relative transition-all duration-200 aspect-square w-full",
                selectedAccessoryId === item.id
                  ? "scale-110 drop-shadow-xl"
                  : "opacity-75 hover:opacity-100 hover:scale-105",
              ].join(" ")}
            >
              <Image src={item.src} alt={item.alt} fill className="object-contain" />
            </button>
          ))}
        </div>
        {hasMoreAccessories && (
          <ExpandButton
            expanded={accessoriesExpanded}
            onClick={() => setAccessoriesExpanded((p) => !p)}
          />
        )}
      </SectionBlock>

      {/* ── TAPETA ───────────────────────────────────────────────────── */}
      <SectionBlock title="Tapety">
        <div className="mb-5">
          <StatCard label="Tapety" current={9} total={10} bgColor="cus-bg-beige" />
        </div>

        {/* Tapety: poměr stran ~3:2 (1440:924), grid 3→4→6 sloupců */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {visibleWallpapers.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedWallpaperId(item.id)}
              className={[
                "relative rounded-md overflow-hidden transition-all duration-200 w-full",
                selectedWallpaperId === item.id
                  ? "ring-4 ring-amber-400 ring-offset-1 scale-[1.04] shadow-md"
                  : "hover:scale-[1.03] hover:shadow-sm",
              ].join(" ")}
              style={{ aspectRatio: "1440 / 924" }}
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover" />
            </button>
          ))}
        </div>

        {hasMoreWallpapers && (
          <ExpandButton
            expanded={wallpapersExpanded}
            onClick={() => setWallpapersExpanded((p) => !p)}
          />
        )}
      </SectionBlock>

      {/* ── FOTKY ───────────────────────────────────────────────────── */}
      <SectionBlock title="Fotky">
        <div className="mb-5">
           <StatCard label="Fotky" current={131} total={150} bgColor="bg-green-700"  />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {wallpaperItems.map((item) => (
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
      {selectedPhoto && (
  <div
    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    onClick={() => setSelectedPhoto(null)}
  >
    {/* close */}
    <button
      onClick={() => setSelectedPhoto(null)}
      className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
    >
      ✕
    </button>

    {/* image */}
    <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
      <Image
        src={selectedPhoto}
        alt="preview"
        fill
        className="object-contain"
      />
    </div>
  </div>
)}

    </div>
  )
}

// ── Sdílená komponenta pro tlačítko rozbalení ─────────────────────────────────
function ExpandButton({
  expanded,
  onClick,
}: {
  expanded: boolean;
  onClick: () => void;
}) {
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

// ── Sekce s nadpisem a béžovým blokem ────────────────────────────────────────
function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-white py-8 px-6">
        <h2 className="text-amber-400 cus-font-impacted-2 uppercase text-center text-6xl tracking-widest">
          {title}
        </h2>
      </div>
      <div className="bg-[#c8bfb0] px-6 py-6">
        {children}
      </div>
    </div>
  );
}