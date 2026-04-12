interface ExperienceBarProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
}

export default function ExperienceBar({ currentXp, nextLevelXp, level }: ExperienceBarProps) {
  // Výpočet procent pro šířku baru (max 100%)
  const progressPercentage = Math.min(Math.round((currentXp / nextLevelXp) * 100), 100);

  return (
    <div className="flex flex-col w-full max-w-md mt-4 text-center">

        {/* Horní info texty */}
        <span className="text-xl font-bold">
            Level {level}
        </span>

        <span className="text-lg">
            {currentXp} / {nextLevelXp} XP
        </span>

      {/* Pozadí baru */}
      <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
        {/* Výplň baru s animací */}
        <div 
          className="h-full bg-red-400"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Pomocný text pod barem (volitelné) */}
      <p className="text-xs text-right mt-1 text-gray-400 italic">
        Zbývá {nextLevelXp - currentXp} XP do další úrovně
      </p>
    </div>
  );
}