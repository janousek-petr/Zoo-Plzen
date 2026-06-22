"use client";

import Image from "next/image";
import ExperienceBar from "@/components/ui/ExperienceBar";

interface BackpackHeroProps {
  wallpaper: string | null;
  avatar: string | null;
  accessory?: string | null;
  level: number;
  xp: number;
  xpMax: number;
}

export default function BackpackHero({
  wallpaper,
  avatar,
  accessory,
  level,
  xp,
  xpMax,
}: BackpackHeroProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>

      {/* TAPETA */}
      {wallpaper ? (
        <Image
          src={wallpaper}
          alt="Tapeta pozadí"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      {/* Přechod dole */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* AVATAR + DOPLNĚK — stejný pattern jako v ProfileTab */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top: "45%" }}
      >
        <div className="relative py-5 pb-10">
          {avatar ? (
            <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={avatar}
                alt="Profilový obrázek"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-30 h-30 rounded-full bg-gray-300 border-4 border-white shadow-xl" />
          )}
          {accessory && (
            <div className="absolute top-0 right-0 w-12 h-12 rotate-12">
              <Image
                src={accessory}
                alt="Doplněk"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* XP BOX — béžový, hodně průhledný */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-6 pb-4"
        style={{ background: "rgba(200, 191, 176, 0.50)" }}
      >
        <ExperienceBar level={level} currentXp={xp} nextLevelXp={xpMax} />
      </div>

    </div>
  );
}