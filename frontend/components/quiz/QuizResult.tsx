"use client";

import Image from "next/image";
import { RiTimeLine, RiMedalLine, RiCopperCoinLine, RiPlayLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { Question } from "@/lib/types";
import { useRouter } from "next/navigation";
import { getHrefName } from "@/components/area/ContinentArea";

interface Props {
  score: number;
  totalPoints: number;
  questions: Question[];
  regionName: string;
  regionColor?: string;
  regionAnimal: string
  level?: number;
  quizId?: number;
  timeLabel?: string;
  selectedAnswers: Set<number>;
}

export default function QuizResult({
  score,
  totalPoints,
  questions,
  regionName,
  regionColor,
  regionAnimal,
  level,
  quizId,
  timeLabel = "—",
  selectedAnswers,
}: Props) {
  const router = useRouter();

    const correctAnswers = questions.filter(q =>
    q.answers.some(a => a.id !== undefined && selectedAnswers.has(a.id) && a.is_correct === 1)
    ).length;
    const wrongAnswers = questions.length - correctAnswers;
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
        <div className="relative h-20" style={{ aspectRatio: "4/3" }}>
            { /*
          <Image
            src={regionAnimal}
            alt="Zvíře"
            fill
            className="object-contain"
            priority
          />
          */}
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
        {/*
        {/* Medaile *//*}
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
        */}

        {/* Pravý sloupec */}
        <div className="flex flex-col gap-2 flex-1">

          {/* Stat pilly */}
          <div className="flex flex-row gap-1">
            <StatPill icon={RiTimeLine} value={timeLabel} color={regionColor} />
            <StatPill icon={RiMedalLine} value={`${score} XP`} color={regionColor} />
            <StatPill icon={RiCopperCoinLine} value={String(Math.round(score / 5))} color={regionColor} />
          </div>

          {/* Správné / špatné */}
          <div className="flex gap-2 mt-1">
            <div className="flex-1 flex flex-col items-center bg-green-500 text-white rounded-xl py-2 px-1">
              <RiCheckLine size={18} />
              <span className="text-2xl font-black leading-tight">{correctAnswers}</span>
              <span className="text-xs font-bold uppercase tracking-wide opacity-90">správně</span>
            </div>
            <div className="flex-1 flex flex-col items-center bg-red-500 text-white rounded-xl py-2 px-1">
              <RiCloseLine size={18} />
              <span className="text-2xl font-black leading-tight">{wrongAnswers}</span>
              <span className="text-xs font-bold uppercase tracking-wide opacity-90">špatně</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tlačítka */}
      <div className="flex flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => router.push("/hry/kontinenty/" + getHrefName(regionName) + "#kviz-sekce")}
          className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white cus-font-impacted-2 uppercase text-xl py-4 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <RiPlayLine size={24} />
          Pokračovat
        </button>
      </div>

    </div>
  );
}

function StatPill({
  icon: Icon,
  value,
  color,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  value?: string;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 text-white font-bold text-sm px-2 py-1.5 rounded-lg flex-1 justify-center"
      style={{ backgroundColor: color ?? undefined }}
    >
      {Icon && <Icon size={16} className="shrink-0" />}
      <span>{value}</span>
    </div>
  );
}