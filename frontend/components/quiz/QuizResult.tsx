"use client";

import Image from "next/image";
import { Question } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  score: number;
  totalPoints: number;
  questions: Question[];
  regionName?: string;
  regionColor?: string;
  level?: number;
  quizId?: number;
  timeLabel?: string;
}

export default function QuizResult({
  score,
  totalPoints,
  questions,
  regionName,
  regionColor,
  level,
  quizId,
  timeLabel = "—",
}: Props) {
  const router = useRouter();
  const correctAnswers = questions.filter(q =>
    q.answers.some(a => a.is_correct === 1)
  ).length;
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const xpBonus = Math.round(score / 10);

  const subtitle =
    percentage >= 80 ? "Zvládl jsi to levou zadní..." :
    percentage >= 50 ? "Dobrý výkon!" :
    "Příště to půjde lépe!";

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 py-10 gap-6">

      {/* Nadpis */}
      <div className="text-center">
        <h1
          className="cus-font-impacted-2 uppercase text-5xl sm:text-6xl leading-tight"
          style={{ color: regionColor }}
        >
          Kvíz dokončen
        </h1>
        <p className="text-gray-600 text-lg mt-1">{subtitle}</p>
      </div>

      {/* Obrázek zvířete */}
      <div className="w-full max-w-sm rounded-xl overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          <Image
            src="/img/photo-no-bg/giraffe.png"
            alt="Zvíře"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Název kvízu */}
      <h2
        className="cus-font-impacted-2 uppercase text-3xl text-center leading-tight"
        style={{ color: regionColor }}
      >
        {regionName} — Level {level}
      </h2>

      {/* Výsledková karta */}
      <div className="w-full max-w-sm bg-[#f0ebe3] rounded-2xl p-4 flex flex-row gap-4 items-start">

        {/* Medaile */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-24 h-24 rounded-full border-[6px] border-orange-400 overflow-hidden relative">
            <Image
              src="/img/medals/medal-africa.png"
              alt="Medaile"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm font-bold text-gray-700 mt-1">
            {score}/{totalPoints}
            <span className="text-green-600 font-extrabold ml-1">+{xpBonus}</span>
          </p>
        </div>

        {/* Pravý sloupec */}
        <div className="flex flex-col gap-2 flex-1">

          {/* Stat pilly */}
          <div className="flex flex-row gap-1">
            <StatPill icon="/img/icons/clock-icon-dark.png" value={timeLabel} color={regionColor} />
            <StatPill icon="/img/icons/medal-icon-dark.png" value={`${score} XP`} color={regionColor} />
            <StatPill icon="/img/icons/currency-icon.png" value={String(Math.round(score / 5))} color={regionColor} />
          </div>

          {/* Počet otázek */}
          <p className="font-extrabold text-gray-800 text-sm uppercase tracking-wide">
            {correctAnswers}/{questions.length} otázek
          </p>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, backgroundColor: regionColor }}
            />
          </div>

        </div>
      </div>

      {/* Tlačítka */}
      <div className="flex flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => router.push("/hry/kontinenty/afrika")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#6ABD83] hover:bg-green-600 active:scale-95 text-white cus-font-impacted-2 uppercase text-xl py-4 rounded-xl transition-all shadow-md"
        >
          <SmallIcon src="/img/icons/play-button.png" />
          Pokračovat
        </button>
      </div>

    </div>
  );
}

function StatPill({ icon, value, color }: { icon?: string | null; value?: string | null; color?: string | null }) {
  return (
    <div
      className="flex items-center gap-1.5 text-white font-bold text-sm px-2 py-1.5 rounded-lg flex-1 justify-center"
      style={{ backgroundColor: color }}
    >
      <div className="relative w-4 h-4 shrink-0">
        </div>
      <span>{value}</span>
    </div>
  );
}

function SmallIcon({ src }: { src: string }) {
  return (
    <div className="relative w-6 h-6 shrink-0">
      <Image src={src} alt="" fill className="object-contain" />
    </div>
  );
}