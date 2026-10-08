"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ExperienceBar from "@/components/ui/ExperienceBar";
import StatCard from "@/components/ui/StatCard";
import { useProfile } from "@/hooks/useProfile";
import { getInventory } from "@/lib/api/inventory";
import { getItems } from "@/lib/api/items";
import type { Item } from "@/lib/types";

const CATEGORY_AVATAR = 1;     // Profilovky
const CATEGORY_ACCESSORY = 2;  // Čepice
const CATEGORY_WALLPAPER = 3;  // Tapety
const CATEGORY_PHOTO = 4;      // Fotky

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveUrl = (path: string | null | undefined): string =>
    path ? (path.startsWith("http") ? path : `${apiBase}${path}`) : "";

// XP potřebné pro další level — jednoduchá formule, uprav dle svého systému
function xpForNextLevel(level: number): number {
  return level * 100 + 100;
}

export default function ProfileTab() {
  const { profile, isLoading, error } = useProfile();
  const [owned, setOwned] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!profile?.id) return;
    getInventory(profile.id).then(setOwned).catch(() => {});
    getItems().then(setAllItems).catch(() => {});
  }, [profile?.id]);

    if (isLoading) return <ProfileSkeleton />;
    if (!profile) return <p className="text-center py-20 text-red-500">Profil nenalezen.</p>;
    if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  const xpMax = xpForNextLevel(profile.level);

  const avatarItems = owned.filter(i => i.category?.id === CATEGORY_AVATAR);
  const accessoryItems = owned.filter(i => i.category?.id === CATEGORY_ACCESSORY);

  const selectedAvatar = avatarItems.find(i => i.id === profile?.avatar_item_id);
  const selectedAccessory = accessoryItems.find(i => i.id === profile?.accessory_item_id);

  const selectedAvatarSrc = resolveUrl(selectedAvatar?.image) ?? resolveUrl(avatarItems[0]?.image) ?? "";
  const selectedAccessorySrc = resolveUrl(selectedAccessory?.image) ?? resolveUrl(accessoryItems[0]?.image) ?? "";

  // current = kolik z kategorie profil vlastní, total = kolik jich v appce celkem existuje
  const countFor = (categoryId: number) => ({
    current: owned.filter(i => i.category?.id === categoryId).length,
    total: allItems.filter(i => i.category?.id === categoryId).length,
  });

  const avatarsCount     = countFor(CATEGORY_AVATAR);
  const accessoriesCount = countFor(CATEGORY_ACCESSORY);
  const wallpapersCount  = countFor(CATEGORY_WALLPAPER);
  const photosCount      = countFor(CATEGORY_PHOTO);

return (
  <>
    {/* Avatar + jméno */}
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 px-4">
      <div className="relative shrink-0">
        <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-200">
          {selectedAvatar && (
            <Image
              src={selectedAvatarSrc}
              alt={`Profilová fotka ${profile.first_name}`}
              fill
              sizes="(min-width: 768px) 192px, 144px"
              className="object-cover"
            />
          )}
        </div>

        {/* Level badge */}
        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-yellow-400 rounded-full w-12 h-12 md:w-16 md:h-16 shadow-lg">
          <span className="font-bold text-xl md:text-2xl text-gray-800">{profile.level}</span>
        </div>

        {/* Doplněk */}
        {selectedAccessory && (
          <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 rotate-[30deg]">
            <div className="relative w-full h-full">
              <Image
                src={selectedAccessorySrc}
                alt="Hat"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="min-w-0 text-center md:text-start">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl cus-font-impacted-2 uppercase leading-none text-sky-600 break-words">
          {profile.nickname}
        </h1>
      </div>
    </div>

    {/* XP bar */}
    <div className="flex justify-center my-8 md:my-10 px-4">
      <div className="w-full max-w-xl min-w-0">
        <ExperienceBar
          level={profile.level}
          currentXp={profile.xp}
          nextLevelXp={xpMax}
        />
      </div>
    </div>

    {/* Statistiky */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-10 w-full max-w-3xl mx-auto px-4">
      <div className="min-w-0"><StatCard label="Profilovky" current={avatarsCount.current} total={avatarsCount.total} bgColor="bg-sky-600"/></div>
      <div className="min-w-0"><StatCard label="Doplňky" current={accessoriesCount.current} total={accessoriesCount.total} bgColor="bg-red-500"/></div>
      <div className="min-w-0"><StatCard label="Tapety" current={wallpapersCount.current} total={wallpapersCount.total}  bgColor="cus-bg-beige" /></div>
      <div className="min-w-0"><StatCard label="Fotky" current={photosCount.current} total={photosCount.total} bgColor="bg-green-700" /></div>
    </div>
  </>
);
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-10 py-20 animate-pulse">
      <div className="w-48 h-48 rounded-full bg-gray-200" />
      <div className="h-16 w-64 bg-gray-200 rounded" />
      <div className="h-6 w-80 bg-gray-200 rounded" />
      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 w-52 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );
}