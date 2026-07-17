"use client";
import Image from "next/image";
import { useEffect } from "react";
import axiosClient from "@/lib/axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { useChallenges } from "@/hooks/useChallenges";
import {generatePalette} from "@/components/area/ColorPaletteGenerator"; // Načtení tvého dříve vytvořeného hooku


// ── Typy ─────────────────────────────────────────────────────────────────────

interface WeeklyChallenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  rewardIconSrc: string;
  rewardIconAlt: string;
  animalSrc: string;
  animalAlt: string;
  animalSide: "left" | "right";
  bgColor: string;   // Nyní očekává HEX z DB (např. '#BD9554')
  textColor: string; // Záložní, pokud by nebyl HEX
  completed: boolean;
}

interface DailyTask {
  id: number;
  order: number;
  orderIconSrc: string;
  orderIconAlt: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  reward: number;
  rewardIconSrc: string;
  rewardIconAlt: string;
  bgColor: string;
  rewardBgColor: string;
}

interface ChallengesData {
  weeklyChallenges: WeeklyChallenge[];
  renewsInHours: number;
  renewIconSrc: string;
  renewIconAlt: string;
  dailyTasks: DailyTask[];
}

// ── Simulace dat (Záloha/Fallback, pokud se data ještě načítají) ─────────────

const mockData: ChallengesData = {
  weeklyChallenges: [
    {
      id: 1,
      title: "LVÍ JÁMA",
      description: "Odpověz správně na 7 Afrických otázek",
      progress: 55,
      target: 7,
      reward: 15,
      rewardIconSrc: "/img/icons/currency-icon.png",
      rewardIconAlt: "Tlapky",
      animalSrc: "/img/photo-no-bg/lion.png",
      animalAlt: "Lev",
      animalSide: "right",
      bgColor: "#BD9554",
      textColor: "text-[#7a4a1e]",
      completed: false
    }
  ],
  renewsInHours: 7,
  renewIconSrc: "/img/icons/hourglass-icon.png",
  renewIconAlt: "Přesýpací hodiny",
  dailyTasks: []
};

// ── Komponenta ────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const { activeProfile } = useAuthContext();

  // Načtení reálných dat z databáze přes tvůj hook
  const { data: serverData, loading } = useChallenges(activeProfile?.id);

  // Pokud máme data ze serveru, použijeme je. Jinak ukážeme mockData jako fallback.
  const data = serverData || mockData;

  useEffect(() => {
    if (activeProfile?.id) {
      axiosClient.post('/api/profiles/claim-daily-reward', {
        profile_id: activeProfile.id
      })
          .then(res => {
            if (res.data.status === 'success') {
              console.log("Super, dostal jsi 20 bodů!");
            } else if (res.data.status === 'already_claimed') {
              console.log("Dnes už byla odměna vybrána, žádné body navíc.");
            }
          })
          .catch(err => {
            console.error("Chyba při připisování denní odměny:", err);
          });
    }
  }, [activeProfile]);

  if (loading && !serverData) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="text-xl font-bold text-green-700 animate-pulse">Načítám výzvy z přírody...</p>
        </div>
    );
  }

  return (
      <main className="w-full">

        {/* ── TÝDENNÍ VÝZVY nadpis ────────────────────────────────────── */}
        <div className="flex justify-center pt-12 pb-28 relative z-0">
          <h1 className="cus-font-impacted-2 uppercase text-green-700 text-4xl sm:text-5xl md:text-6xl tracking-widest text-center">
            Týdenní výzvy
          </h1>
        </div>

        {/* ── VÝZVY ───────────────────────────────────────────────────── */}
        <section className="relative">
          {data.weeklyChallenges.map((challenge, index) => (
              <div
                  key={challenge.id}
                  className="bg-sky-500 relative"
                  style={{
                    paddingTop: index === 0 ? 0 : 120,
                    zIndex: data.weeklyChallenges.length - index
                  }}
              >
                <ChallengeBlock challenge={challenge} />
              </div>
          ))}
        </section>

        {/* ── OBNOVA ──────────────────────────────────────────────────── */}
        <div className="w-full bg-[#6ABD83] py-5 mt-20 text-center text-white relative z-20">
          <p className="font-bold text-lg">Výzvy se obnoví za:</p>
          <div className="flex items-center justify-center gap-3">
            <p className="cus-font-impacted-2 text-4xl tracking-widest">
              {data.renewsInHours} hodin
            </p>
            <span className="relative w-8 h-8 flex-shrink-0 block">
            <Image src={data.renewIconSrc} alt={data.renewIconAlt} fill className="object-contain" />
          </span>
          </div>
        </div>

        {/* ── DENNÍ ÚKOLY nadpis ──────────────────────────────────────── */}
        <div className="flex justify-center py-8">
          <h2 className="cus-font-impacted-2 uppercase text-green-700 text-4xl sm:text-5xl tracking-widest text-center">
            Denní úkoly
          </h2>
        </div>

        {/* ── DENNÍ ÚKOLY ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4 px-4 pb-12">
          {data.dailyTasks.map((task) => (
              <DailyTaskRow key={task.id} task={task} />
          ))}
        </section>

      </main>
  );
}

// ── ChallengeBlock ────────────────────────────────────────────────────────────

function ChallengeBlock({ challenge }: { challenge: WeeklyChallenge }) {
  const isRight = challenge.animalSide === "right";
  const isBear = challenge.id === 3;
  const animalHeight = isBear ? "115%" : "150%";

  // Ověříme, zda barva z DB je HEX (začíná mřížkou)
  const isHexColor = challenge.bgColor?.startsWith("#");

  // Vygenerujeme paletu barev
  const palette = isHexColor ? generatePalette(challenge.bgColor) : null;

  // NASTAVENÍ DYNAMICKÝCH BAREV:
  // Pozadí: palette.secondary (jemná světlá verze barvy regionu)
  // Text: palette.accent (tmavá, kontrastní verze barvy regionu)
  // Progress bar: palette.primary (původní plná barva regionu)

  const computedBgColor = palette ? palette.secondary : undefined;
  const computedTextColor = palette ? palette.accent : undefined;
  const computedProgressColor = palette ? palette.primary : "#8B4513";

  // VÝPOČET PROCENT PRO PROGRESS BAR:
  // Ochráníme kód před dělením nulou, pokud by target náhodou nebyl definován
  const targetValue = challenge.target || 1;
  // Spočítáme procenta a omezíme je maximálně na 100 %, aby progress bar nepřetékal
  const progressPercent = Math.min((challenge.progress / targetValue) * 100, 100);
  return (
      <div
          className={`relative w-full overflow-visible flex items-center px-5 sm:px-16 md:px-24 ${
              !palette ? challenge.bgColor : ""
          } ${isRight ? "justify-start" : "justify-end"}`}
          style={{
            height: "280px",
            backgroundColor: computedBgColor
          }}
      >
        <Image
            src={challenge.animalSrc || "/img/photo-no-bg/lion.png"} // Fallback pro případ chybějícího textu z DB
            alt={challenge.animalAlt}
            className={`absolute bottom-0 w-auto object-bottom z-0 select-none pointer-events-none ${
                isRight ? "right-0" : "left-0"
            }`}
            style={{ height: animalHeight, maxWidth: "none" }}
            draggable={false}
            width={600}
            height={600}
            priority
        />

        <div
            className={`relative z-10 max-w-[55%] sm:max-w-sm ${!palette ? challenge.textColor : ""}`}
            style={{ color: computedTextColor }}
        >
          <h2 className="cus-font-impacted-2 uppercase text-4xl sm:text-5xl md:text-6xl leading-tight">
            {challenge.title}
          </h2>

          <p className="text-base sm:text-lg mt-1">
            {challenge.description}
          </p>

          <div className="mt-3 w-full max-w-[220px]">
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: computedProgressColor
                  }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
          <span className="relative w-12 h-12 flex-shrink-0 block">
            <Image src={challenge.rewardIconSrc} alt={challenge.rewardIconAlt} fill className="object-contain" />
          </span>
            <span className="cus-font-impacted-2 text-4xl">
            {challenge.reward} {challenge.completed && "✅"}
          </span>
          </div>
        </div>
      </div>
  );
}

// ── DailyTaskRow ──────────────────────────────────────────────────────────────

function DailyTaskRow({ task }: { task: DailyTask }) {
  return (
      <div className="flex flex-row gap-3 w-full max-w-xl mx-auto">

        {/* Levý blok */}
        <div className={`flex flex-row items-center gap-6 flex-1 px-6 py-4 rounded-2xl bg-sky-400`}
          style={{background: task.bgColor}}
        >
        <span className="cus-font-impacted-2 text-white text-7xl sm:text-8xl leading-none select-none">
          {task.order}
        </span>
          <div className="flex flex-col">
          <span className="cus-font-impacted-2 text-white uppercase text-2xl tracking-widest leading-tight">
            {task.title}
          </span>
            <span className="text-white text-base mt-0.5">
            {task.description} {task.completed && "✔️"}
          </span>
          </div>
        </div>

        {/* Pravý blok */}
        <div className={`flex flex-row items-center justify-center gap-3 px-6 py-4 rounded-2xl ${task.rewardBgColor} bg-green-400 flex-shrink-0 min-w-[130px]`}>
        <span className="relative w-12 h-12 block">
          <Image src={task.rewardIconSrc} alt={task.rewardIconAlt} fill className="object-contain" />
        </span>
          <span className="text-white font-extrabold text-4xl leading-none">{task.reward}</span>
        </div>

      </div>
  );
}