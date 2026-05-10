"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/lib/api/profiles";
import type { Profile } from "@/lib/types";

export default function ProfileSelection() {
    const router = useRouter();
    const { setActiveProfile, isAuthenticated, isLoading } = useAuthContext();
    const { logout } = useAuth();

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    const customHexColors = [
        "#0072BC", "#ED1C24", "#00A65D",
        "#BD9554", "#FDB913", "#8E5233",
    ];

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/prihlaseni');
        }
    }, [isLoading, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchProfiles();
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
        setActiveProfile(profile);
        router.push('/domov');
    };

    if (isLoading || loadingProfiles) {
        return (
            <main className="flex items-center justify-center">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </main>
        );
    }

    return (
        <main className="flex flex-col justify-center items-center bg-white">
            <h1 className="text-7xl text-center cus-font-impacted-2 uppercase leading-none text-sky-600 pt-5 p-5">
                Zvol si profil
            </h1>
            <h3 className="text-3xl text-center font-bold leading-none text-black pb-10">
                Kdo si dnes zahraje?
            </h3>

            <div className="flex flex-wrap justify-center gap-8">
                {profiles.map((profile, index) => {
                    const hexColor = customHexColors[index % customHexColors.length];
                    return (
                        <div
                            key={profile.id}
                            className="group flex flex-col items-center cursor-pointer"
                            onClick={() => handleSelectProfile(profile)}
                            onMouseEnter={(e) => {
                                const borderDiv = e.currentTarget.querySelector('.profile-border') as HTMLElement;
                                const nameSpan = e.currentTarget.querySelector('.profile-name') as HTMLElement;
                                if (borderDiv) borderDiv.style.borderColor = hexColor;
                                if (nameSpan) nameSpan.style.color = hexColor;
                            }}
                            onMouseLeave={(e) => {
                                const borderDiv = e.currentTarget.querySelector('.profile-border') as HTMLElement;
                                const nameSpan = e.currentTarget.querySelector('.profile-name') as HTMLElement;
                                if (borderDiv) borderDiv.style.borderColor = 'transparent';
                                if (nameSpan) nameSpan.style.color = '#374151';
                            }}
                        >
                            <div className="profile-border relative w-32 h-32 md:w-48 md:h-48 border-8 border-transparent rounded-full p-1 transition-all duration-300">
                                <Image
                                    src={profile.avatar_url ?? '/img/startpage-1.png'}
                                    alt={profile.first_name}
                                    fill
                                    className="object-cover rounded-full"
                                />
                            </div>
                            <span className="profile-name mt-4 text-2xl font-bold text-gray-700 transition-colors duration-300">
                                {profile.first_name}
                            </span>
                        </div>
                    );
                })}

                {/* Přidat profil */}
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
            </div>

            <div className="flex gap-4 mt-16">
                <button className="border-2 font-bold border-gray-400 text-gray-500 px-8 py-3 uppercase tracking-widest hover:border-sky-600 hover:text-sky-600 transition-all">
                    Spravovat profily
                </button>
                <button
                    onClick={() => logout()}
                    className="border-2 font-bold border-red-300 text-red-400 px-8 py-3 uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                >
                    Odhlásit se
                </button>
            </div>
        </main>
    );
}