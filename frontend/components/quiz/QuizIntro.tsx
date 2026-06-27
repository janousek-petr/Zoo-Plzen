"use client";

import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

interface Props {
  regionName: string;
  regionColor: string;
  level: number;
  questionCount: number;
  exitHref: string;
  onStart: () => void;
}

export default function QuizIntro({ regionName, regionColor, level, questionCount, exitHref, onStart }: Props) {
    const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center justify-center px-6 gap-6 py-20">
      <p className="text-lg uppercase tracking-widest text-gray-400 font-semibold">Připrav se!</p>

      <h1
        className="cus-font-impacted-2 uppercase text-6xl text-center"
        style={{ color: regionColor }}
      >
        {regionName}
      </h1>

      <p
        className="text-3xl tracking-widest uppercase"
        style={{ color: regionColor }}
      >
        - Level {level} -
      </p>

      <div className="flex gap-6 mt-2">
        <div className="flex flex-col items-center bg-[#f0ece4] rounded-2xl px-6 py-4">
          <span className="text-3xl font-bold">{questionCount}</span>
          <span className="text-sm text-gray-500 uppercase tracking-wide">otázek</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-4 flex items-center gap-3 px-10 py-4 font-bold uppercase tracking-widest text-lg rounded-md text-white transition-all cursor-pointer"
        style={{ backgroundColor: regionColor }}
      >
        <FaPlay size={16} />
        Spustit kvíz
      </button>

        <div className="flex shrink-0">
            <button
            onClick={() => router.push(exitHref)}
            className="w-10 h-10 rounded-lg border-2 bg-red-500 flex items-center justify-center text-white hover:text-red-500 hover:border-red-400 hover:bg-transparent transition-all cursor-pointer"
            aria-label="Odejít z kvízu"
            >
                <FiLogOut size={18} />
            </button>
        </div>
    </main>
  );
}