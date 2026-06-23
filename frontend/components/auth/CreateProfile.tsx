"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileService from "@/lib/api/profiles";
import { getItems } from "@/lib/api/items";
import { giveItem } from "@/lib/api/inventory";
import type { Item } from "@/lib/types";
import { useAuthContext } from "@/contexts/AuthContext";

// ID kategorií podle tabulky item_category (zkontrolováno v DB)
const CATEGORY_AVATAR = 1;     // Profilovky
const CATEGORY_ACCESSORY = 2;  // Čepice
const CATEGORY_WALLPAPER = 3;  // Tapety

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

// image z backendu chodí jako relativní cesta (/storage/media/xyz.png) -> potřebuje prefix
const resolveUrl = (path: string | null | undefined) =>
    path ? (path.startsWith("http") ? path : `${apiBase}${path}`) : null;

const ADJECTIVES = ["Rychlý", "Chytrý", "Veselý", "Modrý", "Silný", "Tichý", "Barevný"];
const ANIMALS    = ["Papoušek", "Lev", "Vlk", "Tygr", "Medvěd", "Sokol", "Delfín"];

function generateNickname() {
    const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const anim = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const num  = Math.floor(100 + Math.random() * 900);
    return `${adj} ${anim} ${num}`;
}

export default function CreateProfile() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState(generateNickname);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setActiveProfile } = useAuthContext();

    // Items stažené z backendu, rozdělené podle kategorie
    const [itemsLoading, setItemsLoading] = useState(true);
    const [itemsError, setItemsError]     = useState<string | null>(null);
    const [avatars, setAvatars]       = useState<Item[]>([]);
    const [accessories, setAccessories] = useState<Item[]>([]);
    const [wallpapers, setWallpapers] = useState<Item[]>([]);

    // Vybrané hodnoty držíme jako celou položku (ne jen URL), ať máme i id/name k dispozici
    const [avatar, setAvatar]       = useState<Item | null>(null);
    const [accessory, setAccessory] = useState<Item | null>(null);
    const [wallpaper, setWallpaper] = useState<Item | null>(null);

    useEffect(() => {
        getItems()
            .then((data: Item[]) => {
                // Vždy jen první 3 položky (podle nejnižšího id) z každé kategorie
                const byIdAsc = (a: Item, b: Item) => a.id - b.id;
                const firstThree = (cat: number) =>
                    data.filter(i => i.category?.id === cat).sort(byIdAsc).slice(0, 3);

                const av = firstThree(CATEGORY_AVATAR);
                const ac = firstThree(CATEGORY_ACCESSORY);
                const wp = firstThree(CATEGORY_WALLPAPER);

                setAvatars(av);
                setAccessories(ac);
                setWallpapers(wp);

                // Předvyplň první dostupnou položku v každé kategorii (pokud existuje)
                setAvatar(av[0] ?? null);
                setAccessory(ac[0] ?? null);
                setWallpaper(wp[0] ?? null);
            })
            .catch(() => setItemsError('Nepodařilo se načíst předměty.'))
            .finally(() => setItemsLoading(false));
    }, []);

    const handleFinish = async () => {
        setSaving(true);
        setError(null);
        try {
            const response = await profileService.create({
                first_name:    firstName,
                last_name:     lastName,
                avatar_url:    resolveUrl(avatar?.image) ?? '',
                accessory_url: resolveUrl(accessory?.image) ?? '',
                wallpaper_url: resolveUrl(wallpaper?.image) ?? '',
                nickname:      nickname,
            });

            const profile = response.data;

            const selectedItems = [avatar, accessory, wallpaper].filter(Boolean) as Item[];

            // Přidá vybrané předměty do inventáře nového profilu (přes axiosClient,
            // ne ruční fetch - tak appka konzistentně řeší auth/CSRF na všech voláních)
            await Promise.all(
                selectedItems.map((item) => giveItem(profile.id, item.id))
            );

            // Hned equipnout to, co si dítě vybralo, ať se to projeví na profilu
            await Promise.all([
                avatar    ? profileService.update(profile.id, { avatar_item_id: avatar.id })       : null,
                accessory ? profileService.update(profile.id, { accessory_item_id: accessory.id }) : null,
                wallpaper ? profileService.update(profile.id, { wallpaper_item_id: wallpaper.id }) : null,
            ]);

            setActiveProfile(profile)
            router.push('/domov');
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Nepodařilo se vytvořit profil');
            setSaving(false);
        }
    };

    return (
        <main className="bg-white flex flex-col items-center justify-center p-6">

            {/* Progress bar */}
            {step > 2 && (
                <div className="w-full max-w-md mb-10">
                    <div className="flex gap-2">
                        {[3, 4, 5, 6].map((s, i) => (
                            <div
                                key={i}
                                className={`h-3 rounded-full flex-1 transition-all duration-300 ${
                                    step >= s ? 'bg-sky-500' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* KROK 1 — Jméno */}
            {step === 1 && (
                <div className="w-full max-w-md flex flex-col gap-6">
                    <div className="text-center mb-2">
                        <span className="text-sm uppercase tracking-widest text-gray-400 font-bold">Zde zadává informace dospělý</span>
                        <h1 className="cus-font-impacted-2 uppercase text-5xl text-sky-600 mt-2">
                            Jak se jmenuješ?
                        </h1>
                        <p className="text-gray-500 mt-2">Zadejte jméno dítěte</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Jméno</label>
                        <input
                            type="text"
                            className="cus-auth-input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Např. Eliška"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700">Příjmení</label>
                        <input
                            type="text"
                            className="cus-auth-input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Např. Nováková"
                            required
                        />
                    </div>

                    <button
                        className="cus-auth-submit disabled:opacity-50 mt-2"
                        disabled={!firstName.trim() || !lastName.trim()}
                        onClick={() => setStep(2)}
                    >
                        Pokračovat
                    </button>
                </div>
            )}

            {/* KROK 2 — Mezikrok */}
            {step === 2 && (
                <div className="flex flex-col items-center gap-8 text-center">
                    <h1 className="cus-font-impacted-2 uppercase text-7xl text-sky-600 leading-tight">
                        Teď jsi<br />na řadě ty!
                    </h1>
                    <p className="text-2xl text-gray-600 font-medium">
                        Předej tablet <span className="font-black text-sky-600">{firstName}</span>
                    </p>
                    <button
                        onClick={() => setStep(3)}
                        className="mt-4 bg-sky-500 hover:bg-sky-600 text-white cus-font-impacted-2 uppercase text-3xl px-12 py-5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        Jsem připraven
                    </button>
                </div>
            )}

            {/* KROK 3 — Profilovka */}
            {step === 3 && (
                <ChildStep
                    title="Vyber si fotku"
                    onBack={() => setStep(2)}
                    onNext={() => setStep(4)}
                >
                    <ItemGrid
                        items={avatars}
                        selected={avatar}
                        onSelect={setAvatar}
                        loading={itemsLoading}
                        error={itemsError}
                        shape="circle"
                    />
                </ChildStep>
            )}

            {/* KROK 4 — Čepička */}
            {step === 4 && (
                <ChildStep
                    title="Vyber si čepičku"
                    onBack={() => setStep(3)}
                    onNext={() => setStep(5)}
                >
                    <ItemGrid
                        items={accessories}
                        selected={accessory}
                        onSelect={setAccessory}
                        loading={itemsLoading}
                        error={itemsError}
                        shape="contain"
                    />
                </ChildStep>
            )}

            {/* KROK 5 — Tapeta */}
            {step === 5 && (
                <ChildStep
                    title="Vyber si tapetu"
                    onBack={() => setStep(4)}
                    onNext={() => setStep(6)}
                >
                    <ItemGrid
                        items={wallpapers}
                        selected={wallpaper}
                        onSelect={setWallpaper}
                        loading={itemsLoading}
                        error={itemsError}
                        shape="wide"
                    />
                </ChildStep>
            )}

            {/* KROK 6 — Přezdívka */}
            {step === 6 && (
                <ChildStep
                    title="Tvoje přezdívka"
                    onBack={() => setStep(5)}
                    onNext={handleFinish}
                    nextLabel={saving ? "Ukládám..." : "Hotovo"}
                    nextDisabled={saving}
                >
                    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                        <div className="cus-font-impacted text-3xl text-center p-6 bg-gray-100 rounded-3xl w-full">
                            {nickname}
                        </div>
                        <button
                            onClick={() => setNickname(generateNickname())}
                            className="text-sky-600 font-black uppercase tracking-widest hover:text-sky-800 transition-colors"
                        >
                            Zkusit jinou
                        </button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                </ChildStep>
            )}
        </main>
    );
}

// Společná mřížka pro výběr předmětu (avatar / accessory / wallpaper)
function ItemGrid({
    items,
    selected,
    onSelect,
    loading,
    error,
    shape,
}: {
    items: Item[];
    selected: Item | null;
    onSelect: (item: Item) => void;
    loading: boolean;
    error: string | null;
    shape: "circle" | "contain" | "wide";
}) {
    if (loading) {
        return <p className="text-gray-400 text-lg">Načítám nabídku...</p>;
    }
    if (error) {
        return <p className="text-red-500 text-lg">{error}</p>;
    }
    if (items.length === 0) {
        return <p className="text-gray-400 text-lg">Zatím nic k výběru. Doplň předměty v adminu.</p>;
    }

    if (shape === "wide") {
        return (
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
                            selected?.id === item.id
                                ? 'ring-4 ring-yellow-400 ring-offset-2 scale-[1.05] shadow-xl'
                                : 'hover:scale-[1.03] hover:shadow-md'
                        }`}
                        style={{ aspectRatio: '16/9' }}
                    >
                        <Image src={resolveUrl(item.image) ?? ''} alt={item.name} fill className="object-cover" />
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-6 flex-wrap justify-center">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={
                        shape === "circle"
                            ? `relative w-36 h-36 rounded-full overflow-hidden border-8 transition-all duration-200 ${
                                  selected?.id === item.id
                                      ? 'border-yellow-400 scale-110 shadow-2xl'
                                      : 'border-transparent hover:border-sky-300 hover:scale-105'
                              }`
                            : `relative w-36 h-36 rounded-2xl border-8 transition-all duration-200 ${
                                  selected?.id === item.id
                                      ? 'border-yellow-400 scale-110 shadow-2xl'
                                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-sky-300 hover:scale-105'
                              }`
                    }
                >
                    <Image
                        src={resolveUrl(item.image) ?? ''}
                        alt={item.name}
                        fill
                        className={shape === "circle" ? "object-cover" : "object-contain"}
                    />
                </button>
            ))}
        </div>
    );
}

function ChildStep({
    title,
    children,
    onBack,
    onNext,
    nextLabel = "Pokračovat",
    nextDisabled = false,
}: {
    title: string;
    children: React.ReactNode;
    onBack: () => void;
    onNext: () => void;
    nextLabel?: string;
    nextDisabled?: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <h1 className="cus-font-impacted-2 uppercase text-6xl text-sky-600 text-center">
                {title}
            </h1>

            {children}

            <div className="flex gap-4 mt-4 w-full max-w-xs">
                <button
                    onClick={onBack}
                    className="flex-1 border-4 border-gray-300 text-gray-500 font-black text-lg py-4 rounded-2xl hover:border-gray-400 transition-all"
                >
                    Zpet
                </button>
                <button
                    onClick={onNext}
                    disabled={nextDisabled}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-black text-lg py-4 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {nextLabel}
                </button>
            </div>
        </div>
    );
}