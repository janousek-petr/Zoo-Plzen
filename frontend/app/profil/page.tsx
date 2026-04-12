import Image from "next/image";
import ExperienceBar from "@/components/ui/ExperienceBar";
import StatCard from "@/components/ui/StatCard";

// 1. Definice struktury dat (TypeScript interface)
// Takhle bude vypadat tvůj uživatel v databázi
interface UserProfile {
    firstName: string;
    lastName: string;
    avatarUrl: string;
    level: number;
    currentXp: number;
    nextLevelXp: number;
    achievementsCount: number;
    totalAchievements: number;
    medalsCount: number;
    totalMedals: number;
    wallpapersCount: number;
    totalWallpapers: number;
    photosCount: number;
    totalPhotos: number;
}

export default function Profile() {
    // 2. Simulace dat z backendu (Mock data)
    // Až budeš mít backend, tenhle objekt smažeš a nahradíš ho fetch voláním
    const userData: UserProfile = {
        firstName: "Eliška",
        lastName: "Šťastná",
        avatarUrl: "/img/startpage-1.png",
        level: 12,
        currentXp: 31,
        nextLevelXp: 256,
        achievementsCount: 13,
        totalAchievements: 42,
        medalsCount: 5,
        totalMedals: 13,
        wallpapersCount: 49,
        totalWallpapers: 50,
        photosCount: 131,
        totalPhotos: 150,
    };

    return (
        <main className="py-20">
            <div className="flex md:flex-row flex-col justify-center items-center gap-10">
                {/* Kontejner pro obrázek a level */}
                <div className="relative">
                    <Image
                        src={userData.avatarUrl} // Dynamické URL
                        alt={`Profilová fotka ${userData.firstName}`}
                        width={200}
                        height={200}
                        className="rounded-full object-cover"
                    />
                    
                    {/* Level Badge */}
                    <div className="absolute bottom-0 right-0 
                                    flex items-center justify-center 
                                    bg-yellow-400 rounded-full 
                                    w-16 h-16 shadow-lg">
                        <span className="font-bold text-2xl text-gray-800">{userData.level}</span>
                    </div>

                    {/* Malá ikonka čepice/avataru nahoře (pokud ji chceš zachovat) */}
                    <div className="absolute top-0 right-0 w-16 h-16 rotate-30">
                         <Image
                            src={userData.avatarUrl}
                            alt="Hat"
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                    </div>
                </div>

                {/* Dynamické jméno */}
                <div>
                    <h1 className="text-8xl cus-font-impacted-2 uppercase leading-none text-sky-600">
                        {userData.firstName}<br/>{userData.lastName}
                    </h1>
                </div>
            </div>

            <div className="flex justify-center my-10 px-4">
                <ExperienceBar 
                    level={userData.level} 
                    currentXp={userData.currentXp} 
                    nextLevelXp={userData.nextLevelXp} 
                />
            </div>

            {/* Grid statistik - vše taháno z objektu */}
            <div className="grid md:grid-cols-2 gap-x-15 gap-y-10 justify-self-center">

                {/* Úspěchy */}
                <StatCard 
                    label="Úspěchy" 
                    current={userData.achievementsCount} 
                    total={userData.totalAchievements} 
                    bgColor="bg-red-500" 
                />

                {/* Medaile */}
                <StatCard 
                    label="Medaile" 
                    current={userData.medalsCount} 
                    total={userData.totalMedals} 
                    bgColor="bg-sky-600" 
                />

                {/* Tapety */}
                <StatCard 
                    label="Tapety" 
                    current={userData.wallpapersCount} 
                    total={userData.totalWallpapers} 
                    bgColor="cus-bg-beige" 
                />

                {/* Fotky */}
                <StatCard 
                    label="Fotky" 
                    current={userData.photosCount} 
                    total={userData.totalPhotos} 
                    bgColor="bg-green-700" 
                />

            </div>
        </main>
    );
}
