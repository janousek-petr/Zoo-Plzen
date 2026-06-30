"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RiRefreshLine } from "react-icons/ri";
import StatCard from "@/components/ui/StatCard";
import BackpackHero from "@/components/ui/BackpackHero";
import { useProfile } from "@/hooks/useProfile";
import { getInventory, equipItem } from "@/lib/api/inventory";
import { getItems } from "@/lib/api/items";
import profileService from "@/lib/api/profiles";
import type { Item } from "@/lib/types";

const CATEGORY_AVATAR = 1;
const CATEGORY_ACCESSORY = 2;
const CATEGORY_WALLPAPER = 3;
const CATEGORY_PHOTO = 4;

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveUrl = (path: string | null | undefined): string | null =>
    path ? (path.startsWith("http") ? path : `${apiBase}${path}`) : null;

const WALLPAPER_FIRST_ROW = 6;

const ADJECTIVES = ["Rychlý", "Chytrý", "Veselý", "Modrý", "Silný", "Tichý", "Barevný"];
const ANIMALS    = ["Papoušek", "Lev", "Vlk", "Tygr", "Medvěd", "Sokol", "Delfín"];

function generateNickname() {
    const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const anim = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const num  = Math.floor(100 + Math.random() * 900);
    return `${adj}${anim}${num}`;
}

export default function BackpackTab() {
  const { profile, isSaving, refresh } = useProfile();

  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [equippingId, setEquippingId] = useState<number | null>(null);

  const [accessoriesExpanded, setAccessoriesExpanded] = useState(false);
  const [avatarsExpanded,     setAvatarsExpanded]     = useState(false);
  const [wallpapersExpanded,  setWallpapersExpanded]  = useState(false);
  const [selectedPhoto,       setSelectedPhoto]       = useState<string | null>(null);

  // Přezdívka
  const [nickname, setNickname]           = useState("");
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const [nicknameSaved, setNicknameSaved]   = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    setNickname(profile.nickname ?? "");
    setItemsLoading(true);
    getInventory(profile.id)
      .then(setItems)
      .catch(() => setItemsError('Nepodařilo se načíst inventář.'))
      .finally(() => setItemsLoading(false));
    getItems().then(setAllItems).catch(() => {});
  }, [profile?.id, profile?.nickname]);

  const avatarItems     = items.filter(i => i.category?.id === CATEGORY_AVATAR);
  const accessoryItems  = items.filter(i => i.category?.id === CATEGORY_ACCESSORY);
  const wallpaperItems  = items.filter(i => i.category?.id === CATEGORY_WALLPAPER);
  const photoItems      = items.filter(i => i.category?.id === CATEGORY_PHOTO);
  const totalPhotoCount = allItems.filter(i => i.category?.id === CATEGORY_PHOTO).length;

  const visibleAvatars     = avatarsExpanded     ? avatarItems     : avatarItems.slice(0, 10);
  const visibleAccessories = accessoriesExpanded ? accessoryItems  : accessoryItems.slice(0, 10);
  const visibleWallpapers  = wallpapersExpanded  ? wallpaperItems  : wallpaperItems.slice(0, WALLPAPER_FIRST_ROW);

  const selectedAvatar    = avatarItems.find(i => i.id === profile?.avatar_item_id);
  const selectedAccessory = accessoryItems.find(i => i.id === profile?.accessory_item_id);
  const selectedWallpaper = wallpaperItems.find(i => i.id === profile?.wallpaper_item_id);

  const selectedAvatarSrc    = resolveUrl(selectedAvatar?.image)    ?? resolveUrl(avatarItems[0]?.image);
  const selectedAccessorySrc = resolveUrl(selectedAccessory?.image) ?? resolveUrl(accessoryItems[0]?.image);
  const selectedWallpaperSrc = resolveUrl(selectedWallpaper?.image) ?? resolveUrl(wallpaperItems[0]?.image);

  const handleEquip = async (item: Item) => {
    if (!profile?.id) return;
    setEquippingId(item.id);
    try {
      await equipItem(profile.id, item.id);
      await refresh();
    } catch {
      setItemsError('Nepodařilo se equipnout předmět.');
    } finally {
      setEquippingId(null);
    }
  };

  const handleNicknameReroll = () => {
    setNickname(generateNickname());
    setNicknameSaved(false);
  };

  const handleNicknameSave = async () => {
    if (!profile?.id || !nickname.trim()) return;
    setNicknameSaving(true);
    try {
      await profileService.update(profile.id, { nickname });
      await refresh();
      setNicknameSaved(true);
      setTimeout(() => setNicknameSaved(false), 2000);
    } catch {
      setItemsError('Nepodařilo se uložit přezdívku.');
    } finally {
      setNicknameSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="w-full">
      {(isSaving || equippingId !== null) && (
        <div className="fixed top-4 right-4 z-50 bg-amber-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg animate-pulse">
          Ukládám...
        </div>
      )}

      {itemsError && (
        <div className="fixed top-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
          {itemsError}
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

      {/* PŘEZDÍVKA */}
      <SectionBlock title="Přezdívka">
        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <div className="w-full bg-white rounded-2xl px-6 py-4 text-center">
            <p className="cus-font-impacted text-3xl text-gray-800">{nickname || "—"}</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleNicknameReroll}
              className="flex-1 flex items-center justify-center gap-2 border-4 border-amber-400 text-amber-500 font-black uppercase tracking-widest py-3 rounded-2xl hover:bg-amber-50 transition-all"
            >
              <RiRefreshLine size={20} />
              Zkusit jinou
            </button>
            <button
              onClick={handleNicknameSave}
              disabled={nicknameSaving || nickname === (profile.nickname ?? "")}
              className="flex-1 font-black uppercase tracking-widest py-3 rounded-2xl transition-all disabled:opacity-50
                bg-amber-400 hover:bg-amber-500 text-white"
            >
              {nicknameSaving ? "Ukládám…" : nicknameSaved ? "Uloženo!" : "Uložit"}
            </button>
          </div>
        </div>
      </SectionBlock>

      {/* PROFILOVKY */}
      <SectionBlock title="Profilovky">
        {itemsLoading ? (
          <p className="text-gray-500">Načítám...</p>
        ) : avatarItems.length === 0 ? (
          <p className="text-gray-500">Zatím nevlastníš žádnou profilovku.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 py-2">
            {visibleAvatars.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEquip(item)}
                disabled={equippingId === item.id}
                className={[
                  "relative rounded-full overflow-hidden shadow-md transition-all duration-200 aspect-square w-full disabled:opacity-50",
                  item.id === profile.avatar_item_id
                    ? "ring-4 ring-amber-400 ring-offset-2 scale-105"
                    : "hover:scale-105 hover:shadow-lg",
                ].join(" ")}
              >
                <Image src={resolveUrl(item.image) ?? ''} alt={item.name} fill className="object-cover rounded-full" />
              </button>
            ))}
          </div>
        )}
        {avatarItems.length > 10 && (
          <ExpandButton expanded={avatarsExpanded} onClick={() => setAvatarsExpanded((p) => !p)} />
        )}
      </SectionBlock>

      {/* DOPLŇKY */}
      <SectionBlock title="Doplňky">
        {itemsLoading ? (
          <p className="text-gray-500">Načítám...</p>
        ) : accessoryItems.length === 0 ? (
          <p className="text-gray-500">Zatím nevlastníš žádný doplněk.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 py-2">
            {visibleAccessories.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEquip(item)}
                disabled={equippingId === item.id}
                className={[
                  "relative transition-all duration-200 aspect-square w-full disabled:opacity-50",
                  item.id === profile.accessory_item_id
                    ? "ring-4 ring-amber-400 ring-offset-1 scale-[1.04] shadow-md"
                    : "opacity-75 hover:opacity-100 hover:scale-105",
                ].join(" ")}
              >
                <Image src={resolveUrl(item.image) ?? ''} alt={item.name} fill className="object-contain" />
              </button>
            ))}
          </div>
        )}
        {accessoryItems.length > 10 && (
          <ExpandButton expanded={accessoriesExpanded} onClick={() => setAccessoriesExpanded((p) => !p)} />
        )}
      </SectionBlock>

      {/* TAPETY */}
      <SectionBlock title="Tapety">
        <div className="mb-5">
          <StatCard label="Tapety" current={wallpaperItems.length} total={10} bgColor="cus-bg-beige" />
        </div>
        {itemsLoading ? (
          <p className="text-gray-500">Načítám...</p>
        ) : wallpaperItems.length === 0 ? (
          <p className="text-gray-500">Zatím nevlastníš žádnou tapetu.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {visibleWallpapers.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEquip(item)}
                disabled={equippingId === item.id}
                className={[
                  "relative rounded-md overflow-hidden transition-all duration-200 w-full disabled:opacity-50",
                  item.id === profile.wallpaper_item_id
                    ? "ring-4 ring-amber-400 ring-offset-1 scale-[1.04] shadow-md"
                    : "hover:scale-[1.03] hover:shadow-sm",
                ].join(" ")}
                style={{ aspectRatio: "1440 / 924" }}
              >
                <Image src={resolveUrl(item.image) ?? ''} alt={item.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
        {wallpaperItems.length > WALLPAPER_FIRST_ROW && (
          <ExpandButton expanded={wallpapersExpanded} onClick={() => setWallpapersExpanded((p) => !p)} />
        )}
      </SectionBlock>

      {/* FOTKY */}
      <SectionBlock title="Fotky">
        <div className="mb-5">
          <StatCard label="Fotky" current={photoItems.length} total={totalPhotoCount} bgColor="bg-green-700" />
        </div>
        {itemsLoading ? (
          <p className="text-gray-500">Načítám...</p>
        ) : photoItems.length === 0 ? (
          <p className="text-gray-500">Zatím nevlastníš žádnou fotku.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {photoItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedPhoto(resolveUrl(item.image) ?? '')}
                className="relative rounded-md overflow-hidden w-full aspect-1440/924 hover:scale-[1.03] transition"
              >
                <Image src={resolveUrl(item.image) ?? ''} alt={item.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
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