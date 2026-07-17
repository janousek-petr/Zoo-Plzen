"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiPencilLine, RiCloseLine, RiCheckLine } from "react-icons/ri";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/lib/api/profiles";
import { getItems } from "@/lib/api/items";
import type { Profile, Item } from "@/lib/types";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
const resolveUrl = (path: string | null | undefined) =>
    path ? (path.startsWith("http") ? path : `${apiBase}${path}`) : null;

// Najde obrázky avataru a doplňku podle *_item_id profilu v seznamu všech itemů.
function resolveProfileVisuals(profile: Profile, allItems: Item[]) {
    const avatarItem = allItems.find(i => i.id === profile.avatar_item_id);
    const accessoryItem = allItems.find(i => i.id === profile.accessory_item_id);
    return {
        avatarSrc: resolveUrl(avatarItem?.image),
        accessorySrc: resolveUrl(accessoryItem?.image),
    };
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
    profile: Profile;
    avatarSrc: string | null;
    accessorySrc: string | null;
    onClose: () => void;
    onSave: (id: number, data: { first_name: string; last_name: string;}) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

function EditModal({ profile, avatarSrc, accessorySrc, onClose, onSave, onDelete }: EditModalProps) {
    const [firstName, setFirstName] = useState(profile.first_name);
    const [lastName, setLastName]   = useState(profile.last_name ?? "");
    const [saving, setSaving]       = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await profileService.update(profile.id, {first_name : firstName, last_name : lastName})
            await onSave(profile.id, { first_name: firstName, last_name: lastName});
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        setSaving(true);
        try {
            await profileService.destroy(profile.id);
            onDelete(profile.id)
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const fields = [
        { label: "Jméno",      value: firstName, set: setFirstName, placeholder: "Např. Eliška" },
        { label: "Příjmení",   value: lastName,  set: setLastName,  placeholder: "Např. Nováková" },
    ] as const;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="bg-white w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-sky-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-xl font-bold uppercase tracking-widest cus-font-impacted">
                        Upravit profil
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <RiCloseLine size={28} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {/* Avatar preview (jen zobrazení, bez uploadu) */}
                    <div className="flex justify-center mb-1">
                        <div className="relative w-24 h-24">
                            {avatarSrc ? (
                                <Image
                                    src={avatarSrc}
                                    alt={profile.first_name}
                                    fill
                                    className="object-cover rounded-full border-4 border-sky-200"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 border-4 border-sky-200" />
                            )}
                            {accessorySrc && (
                                <Image
                                    src={accessorySrc}
                                    alt="čepička"
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                    </div>

                    {/* Fieldy */}
                    {fields.map(({ label, value, set, placeholder }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {label}
                            </label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                placeholder={placeholder}
                                className="border-2 border-gray-200 focus:border-sky-500 rounded-lg px-4 py-2.5 text-gray-800 font-semibold outline-none transition-colors"
                            />
                        </div>
                    ))}

                    {/* Akce */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={handleSave}
                            disabled={saving || !firstName.trim()}
                            className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg uppercase tracking-widest text-sm transition-colors cursor-pointer"
                        >
                            {saving ? "Ukládám…" : "Uložit"}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={saving}
                            className={`flex-1 border-2 font-bold py-2.5 rounded-lg uppercase tracking-widest text-sm transition-all cursor-pointer
                                ${confirmDelete
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-red-300 text-red-400 hover:border-red-500 hover:text-red-500"
                                }`}
                        >
                            {confirmDelete ? "Opravdu smazat?" : "Smazat"}
                        </button>
                    </div>
                    {confirmDelete && (
                        <p className="text-xs text-red-400 text-center -mt-2">
                            Klikni znovu pro potvrzení smazání profilu.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProfileSelection() {
    const router = useRouter();
    const { setActiveProfile, isAuthenticated, isLoading } = useAuthContext();
    const { logout } = useAuth();

    const [profiles, setProfiles]           = useState<Profile[]>([]);
    const [allItems, setAllItems]           = useState<Item[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);
    const [isManaging, setIsManaging]       = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

    const customHexColors = [
        "#0072BC", "#ED1C24", "#00A65D",
        "#BD9554", "#FDB913", "#8E5233",
    ];

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/prihlaseni');
    }, [isLoading, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchProfiles();
        getItems().then(setAllItems).catch(() => {});
    }, [isAuthenticated]);

    const fetchProfiles = async () => {
        try {
            const response = await profileService.getAll();
            setProfiles(response.data);
        } catch (err) {
            console.error('Nepodařilo se načíst profily', err);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const handleSelectProfile = (profile: Profile) => {
        if (isManaging) { setEditingProfile(profile); return; }
        setActiveProfile(profile);
        router.push('/domov');
    };

    const handleSaveProfile = async (id: number, data: { first_name: string; last_name: string;}) => {
        // TODO: await profileService.update(id, data)
        setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
    };

    const handleDeleteProfile = async (id: number) => {
        // TODO: await profileService.delete(id)
        setProfiles((prev) => prev.filter((p) => p.id !== id));
    };

    if (isLoading || loadingProfiles) {
        return (
            <main className="flex items-center justify-center">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </main>
        );
    }

    return (
        <>
            <main className="flex flex-col justify-center items-center bg-white">
                <h1 className="text-7xl text-center cus-font-impacted-2 uppercase leading-none text-sky-600 pt-5 p-5">
                    {isManaging ? "Správa profilů" : "Zvol si profil"}
                </h1>
                <h3 className="text-3xl text-center font-bold leading-none text-black pb-10">
                    {isManaging ? "Klikni na profil pro úpravu" : "Kdo si dnes zahraje?"}
                </h3>

                <div className="flex flex-wrap justify-center gap-8">
                    {profiles.map((profile, index) => {
                        const hexColor = customHexColors[index % customHexColors.length];
                        const { avatarSrc, accessorySrc } = resolveProfileVisuals(profile, allItems);
                        return (
                            <div
                                key={profile.id}
                                className="group flex flex-col items-center cursor-pointer"
                                onClick={() => handleSelectProfile(profile)}
                                onMouseEnter={(e) => {
                                    const borderDiv = e.currentTarget.querySelector('.profile-border') as HTMLElement;
                                    const nameSpan  = e.currentTarget.querySelector('.profile-name') as HTMLElement;
                                    if (borderDiv) borderDiv.style.borderColor = hexColor;
                                    if (nameSpan)  nameSpan.style.color = hexColor;
                                }}
                                onMouseLeave={(e) => {
                                    const borderDiv = e.currentTarget.querySelector('.profile-border') as HTMLElement;
                                    const nameSpan  = e.currentTarget.querySelector('.profile-name') as HTMLElement;
                                    if (borderDiv) borderDiv.style.borderColor = 'transparent';
                                    if (nameSpan)  nameSpan.style.color = '#374151';
                                }}
                            >
                                {/* Avatar + čepička */}
                                <div className="profile-border relative w-32 h-32 md:w-48 md:h-48 border-8 border-transparent rounded-full p-1 transition-all duration-300">
                                    {avatarSrc ? (
                                        <Image
                                            src={avatarSrc}
                                            alt={profile.first_name}
                                            fill
                                            className={`object-cover rounded-full transition-all duration-300 ${isManaging ? "brightness-75" : ""}`}
                                        />
                                    ) : (
                                        <div className={`w-full h-full rounded-full bg-gray-300 transition-all duration-300 ${isManaging ? "brightness-75" : ""}`} />
                                    )}

                                    {/* Čepička */}
                                    {accessorySrc && !isManaging && (
                                        <Image
                                            src={accessorySrc}
                                            alt="čepička"
                                            fill
                                            className="object-contain"
                                        />
                                    )}

                                    {/* Manage overlay */}
                                    {isManaging && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full">
                                            <RiPencilLine size={48} className="text-white drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>

                                <span className="profile-name mt-4 text-2xl font-bold text-gray-700 transition-colors duration-300">
                                    {profile.first_name}
                                </span>
                            </div>
                        );
                    })}

                    {/* Přidat profil */}
                    {!isManaging && (
                        <div
                            className="group flex flex-col items-center cursor-pointer"
                            onClick={() => router.push('/vytvoreni-profilu')}
                        >
                            <div className="relative w-32 h-32 md:w-48 md:h-48 border-4 border-dashed border-gray-300 group-hover:border-sky-600 group-hover:bg-sky-50 rounded-full flex items-center justify-center transition-all duration-300">
                                <span className="text-9xl text-gray-300 group-hover:text-sky-600 transition-all duration-300 leading-none pb-3 select-none">
                                    +
                                </span>
                            </div>
                            <span className="mt-4 text-xl font-medium text-gray-400 group-hover:text-sky-600 transition-colors">
                                Přidat profil
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-16">
                    <button
                        onClick={() => setIsManaging((v) => !v)}
                        className={`flex items-center gap-2 border-2 font-bold px-8 py-3 uppercase tracking-widest transition-all cursor-pointer
                            ${isManaging
                                ? "border-sky-600 text-sky-600 bg-sky-50"
                                : "border-gray-400 text-gray-500 hover:border-sky-600 hover:text-sky-600"
                            }`}
                    >
                        {isManaging ? "Hotovo" : "Spravovat profily"}
                    </button>
                    {!isManaging && (
                        <button
                            onClick={() => logout()}
                            className="border-2 font-bold border-red-300 text-red-400 px-8 py-3 uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
                        >
                            Odhlásit se
                        </button>
                    )}
                </div>
            </main>

            {editingProfile && (() => {
                const { avatarSrc, accessorySrc } = resolveProfileVisuals(editingProfile, allItems);
                return (
                    <EditModal
                        profile={editingProfile}
                        avatarSrc={avatarSrc}
                        accessorySrc={accessorySrc}
                        onClose={() => setEditingProfile(null)}
                        onSave={handleSaveProfile}
                        onDelete={handleDeleteProfile}
                    />
                );
            })()}
        </>
    );
}