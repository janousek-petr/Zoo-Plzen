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

const resolveUrl = (path: string | null | undefined): string | null =>
    path ? (path.startsWith("http") ? path : `${apiBase}${path}`) : null;

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

  const avatarItem = owned.find(i => i.category?.id === CATEGORY_AVATAR && i.id === profile.avatar_item_id);
  const accessoryItem = owned.find(i => i.category?.id === CATEGORY_ACCESSORY && i.id === profile.accessory_item_id);

  const avatarSrc = resolveUrl(avatarItem?.image);
  const accessorySrc = resolveUrl(accessoryItem?.image);

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
      <div className="flex md:flex-row flex-col justify-center items-center gap-10">
        <div className="relative">
          <div className="relative w-50 h-50 rounded-full overflow-hidden bg-gray-200">
            {avatarSrc && (
              <Image
                src={avatarSrc}
                alt={`Profilová fotka ${profile.first_name}`}
                fill
                className="object-cover"
              />
            )}
          </div>
          {/* Level badge */}
          <div className="absolute bottom-0 right-0 flex items-center justify-center bg-yellow-400 rounded-full w-16 h-16 shadow-lg">
            <span className="font-bold text-2xl text-gray-800">{profile.level}</span>
          </div>
          {/* Doplněk */}
          {accessorySrc && (
            <div className="absolute top-0 right-0 w-16 h-16 rotate-30">
              <div className="relative w-full h-full">
                <Image
                    src={accessorySrc}
                    alt="Hat"
                    fill
                    className="object-contain rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-8xl cus-font-impacted-2 uppercase leading-none text-sky-600">
            {profile.first_name}
            <br />
            {profile.last_name}
          </h1>
          {profile.nickname && (
            <p className="text-center text-gray-500 text-xl mt-2">@{profile.nickname}</p>
          )}
        </div>
      </div>

      {/* XP bar */}
      <div className="flex justify-center my-10 px-4">
        <ExperienceBar
          level={profile.level}
          currentXp={profile.xp}
          nextLevelXp={xpMax}
        />
      </div>

      {/* Statistiky — vlastněno / celkem existující v kategorii */}
      <div className="grid md:grid-cols-2 gap-x-15 gap-y-10 justify-self-center">
        <StatCard label="Profilovky" current={avatarsCount.current}     total={avatarsCount.total}     bgColor="bg-sky-600"   />
        <StatCard label="Doplňky"    current={accessoriesCount.current} total={accessoriesCount.total} bgColor="bg-red-500"   />
        <StatCard label="Tapety"     current={wallpapersCount.current}  total={wallpapersCount.total}  bgColor="cus-bg-beige" />
        <StatCard label="Fotky"      current={photosCount.current}      total={photosCount.total}      bgColor="bg-green-700" />
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