import Image from "next/image";
import ExperienceBar from "@/components/ui/ExperienceBar";
import StatCard from "@/components/ui/StatCard";

// Typ dat profilu — přesuň do types/index.ts pokud ho používáš na více místech
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

// Simulace dat — nahraď API voláním (např. přes fetch nebo React Query)
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

export default function ProfileTab() {
  return (
    <>
      {/* Avatar + jméno */}
      <div className="flex md:flex-row flex-col justify-center items-center gap-10">
        <div className="relative">
          <Image
            src={userData.avatarUrl}
            alt={`Profilová fotka ${userData.firstName}`}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />

          {/* Level badge */}
          <div className="absolute bottom-0 right-0 flex items-center justify-center bg-yellow-400 rounded-full w-16 h-16 shadow-lg">
            <span className="font-bold text-2xl text-gray-800">
              {userData.level}
            </span>
          </div>

          {/* Doplněk (klobouk) */}
          <div className="absolute top-0 right-0 w-16 h-16 rotate-30">
            <Image
              src={"/img/accessories/accessory-1.png"}
              alt="Hat"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
        </div>

        <div>
          <h1 className="text-8xl cus-font-impacted-2 uppercase leading-none text-sky-600">
            {userData.firstName}
            <br />
            {userData.lastName}
          </h1>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex justify-center my-10 px-4">
        <ExperienceBar
          level={userData.level}
          currentXp={userData.currentXp}
          nextLevelXp={userData.nextLevelXp}
        />
      </div>

      {/* Statistiky */}
      <div className="grid md:grid-cols-2 gap-x-15 gap-y-10 justify-self-center">
        <StatCard label="Úspěchy"  current={userData.achievementsCount} total={userData.totalAchievements} bgColor="bg-red-500"    />
        <StatCard label="Medaile"  current={userData.medalsCount}       total={userData.totalMedals}       bgColor="bg-sky-600"    />
        <StatCard label="Tapety"   current={userData.wallpapersCount}   total={userData.totalWallpapers}   bgColor="cus-bg-beige"  />
        <StatCard label="Fotky"    current={userData.photosCount}       total={userData.totalPhotos}       bgColor="bg-green-700"  />
      </div>
    </>
  );
}