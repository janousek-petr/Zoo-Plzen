"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileService from "@/lib/api/profiles";

const AVATARS = [
    { id: 1, src: "/img/startpage-1.png", alt: "Profilovka 1" },
    { id: 2, src: "/img/startpage-2.png", alt: "Profilovka 2" },
    { id: 3, src: "/img/startpage-3.png", alt: "Profilovka 3" },
];

const ACCESSORIES = [
    { id: 1, src: "/img/accessories/accessory-1.png", alt: "Čepička 1" },
];

const WALLPAPERS = [
    { id: 1, src: "/img/photo/image-1.jpg", alt: "Tapeta 1" },
    { id: 2, src: "/img/photo/image-2.jpg", alt: "Tapeta 2" },
    { id: 3, src: "/img/photo/image-3.png", alt: "Tapeta 3" },
];

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

    const [step, setStep]           = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [avatar, setAvatar]       = useState(AVATARS[0].src);
    const [accessory, setAccessory] = useState(ACCESSORIES[0].src);
    const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].src);
    const [nickname, setNickname]   = useState(generateNickname);
    const [saving, setSaving]       = useState(false);
    const [error, setError]         = useState<string | null>(null);

    const handleFinish = async () => {
        setSaving(true);
        setError(null);
        try {
            await profileService.create({
                first_name:    firstName,
                last_name:     lastName,
                avatar_url:    avatar,
                accessory_url: accessory,
                wallpaper_url: wallpaper,
                nickname:      nickname,
            });
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
                    <div className="flex gap-6 flex-wrap justify-center">
                        {AVATARS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setAvatar(item.src)}
                                className={`relative w-36 h-36 rounded-full overflow-hidden border-8 transition-all duration-200 ${
                                    avatar === item.src
                                        ? 'border-yellow-400 scale-110 shadow-2xl'
                                        : 'border-transparent hover:border-sky-300 hover:scale-105'
                                }`}
                            >
                                <Image src={item.src} alt={item.alt} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </ChildStep>
            )}

            {/* KROK 4 — Čepička */}
            {step === 4 && (
                <ChildStep
                    title="Vyber si čepičku"
                    onBack={() => setStep(3)}
                    onNext={() => setStep(5)}
                >
                    <div className="flex gap-6 flex-wrap justify-center">
                        {ACCESSORIES.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setAccessory(item.src)}
                                className={`relative w-36 h-36 transition-all duration-200 ${
                                    accessory === item.src
                                        ? 'scale-110 drop-shadow-2xl'
                                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                <Image src={item.src} alt={item.alt} fill className="object-contain" />
                            </button>
                        ))}
                    </div>
                </ChildStep>
            )}

            {/* KROK 5 — Tapeta */}
            {step === 5 && (
                <ChildStep
                    title="Vyber si tapetu"
                    onBack={() => setStep(4)}
                    onNext={() => setStep(6)}
                >
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                        {WALLPAPERS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setWallpaper(item.src)}
                                className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
                                    wallpaper === item.src
                                        ? 'ring-4 ring-yellow-400 ring-offset-2 scale-[1.05] shadow-xl'
                                        : 'hover:scale-[1.03] hover:shadow-md'
                                }`}
                                style={{ aspectRatio: '16/9' }}
                            >
                                <Image src={item.src} alt={item.alt} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
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