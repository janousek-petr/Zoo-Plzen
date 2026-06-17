"use client";

import Image from "next/image";
import ExperienceBar from "@/components/ui/ExperienceBar";
import StatCard from "@/components/ui/StatCard";
import { useProfile } from "@/hooks/useProfile";

// XP potřebné pro další level — jednoduchá formule, uprav dle svého systému
function xpForNextLevel(level: number): number {
  return level * 100 + 100;
}

export default function ProfileTab() {
  const { profile, isLoading, error } = useProfile();

    if (isLoading) return <ProfileSkeleton />;
    if (!profile) return <p className="text-center py-20 text-red-500">Profil nenalezen.</p>;
    if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  const xpMax = xpForNextLevel(profile.level);

  return (
    <>
      {/* Avatar + jméno */}
      <div className="flex md:flex-row flex-col justify-center items-center gap-10">
        <div className="relative">
          <Image
            src={profile.avatar_url ?? "/img/startpage-1.png"}
            alt={`Profilová fotka ${profile.first_name}`}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
          {/* Level badge */}
          <div className="absolute bottom-0 right-0 flex items-center justify-center bg-yellow-400 rounded-full w-16 h-16 shadow-lg">
            <span className="font-bold text-2xl text-gray-800">{profile.level}</span>
          </div>
          {/* Doplněk */}
          <div className="absolute top-0 right-0 w-16 h-16 rotate-30">
            <Image
                src={profile.accessory_url ?? "/img/accessories/accessory-1.png"}
                alt="Hat"
                width={64}
                height={64}
                className="rounded-full"
            />
            </div>
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

      {/* Statistiky — zatím placeholdery, až budeš mít endpointy rozšíř */}
      <div className="grid md:grid-cols-2 gap-x-15 gap-y-10 justify-self-center">
        <StatCard label="Úspěchy"  current={0}  total={42}  bgColor="bg-red-500"   />
        <StatCard label="Medaile"  current={0}  total={13}  bgColor="bg-sky-600"   />
        <StatCard label="Tapety"   current={0}  total={50}  bgColor="cus-bg-beige" />
        <StatCard label="Fotky"    current={0}  total={150} bgColor="bg-green-700" />
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