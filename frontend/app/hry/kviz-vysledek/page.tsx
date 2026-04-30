"use client";

import Image from "next/image";

// ── Barvy ─────────────────────────────────────────────────────────────────────
const HEADING_COLOR = "#BD9554";

// ── Barvy tří stat pillů — změň si každou podle sebe ─────────────────────────
const PILL_COLORS = {
  time:   "#BD9554",   // 🕐 čas      — oranžová
  xp:     "#E6B666",   // ⚡ XP        — modrá
  points: "#D4AF74",   // 🐾 body      — zelená
};

// ── Typy ─────────────────────────────────────────────────────────────────────
interface QuizCategory {
  iconSrc?: string;     // cesta k obrázku ikony kategorie
  label: string;
  progress?: number;
  badge?: {
    count: number;
    iconSrc?: string;   // cesta k obrázku ikony odznaku (packy)
  };
}

interface QuizResultData {
  title: string;
  subtitle: string;
  animalImageSrc: string;
  animalImageAlt: string;
  quizName: string;
  medalImageSrc: string;
  medalImageAlt: string;
  medalXpCurrent: number;
  medalXpMax: number;
  medalXpBonus: number;
  timeLabel: string;
  xpGained: number;
  pointsGained: number;
  pointsIconSrc?: string;   // cesta k obrázku ikonky packy
  correctAnswers: number;
  totalQuestions: number;
  categories: QuizCategory[];
  xpProgressCurrent: number;
  xpProgressMax: number;
  onRetry:    () => void;
  onContinue: () => void;
}

// ── Simulace dat ──────────────────────────────────────────────────────────────
const mockResult: QuizResultData = {
  title:           "KVÍZ DOKONČEN",
  subtitle:        "Zvládl jsi to levou zadní...",
  animalImageSrc:  "/img/photo/image-3.png",
  animalImageAlt:  "Etiopská želva",
  quizName:        "ETIOPSKÁ OBLAST - LEVEL 1",
  medalImageSrc:   "/img/medals/medal-africa.png",
  medalImageAlt:   "Medaile",
  medalXpCurrent:  100,
  medalXpMax:      100,
  medalXpBonus:    2,
  timeLabel:       "4:31",
  xpGained:        18,
  pointsGained:    10,
  pointsIconSrc:   "/img/icons/currency-icon.png",   // ← vlož cestu k obrázku packy
  correctAnswers:  4,
  totalQuestions:  10,
  categories: [
    {
      iconSrc:  "/img/icons/tasks-button.png",       // ← vlož cestu k ikoně kategorie
      label:    "PŘÍRODOVĚDEC",
      progress: 60,
    },
    {
      iconSrc:  "/img/icons/tasks-button.png",       // ← vlož cestu k ikoně kategorie
      label:    "SAFARI",
      badge: {
        count:   5,
        iconSrc: "/img/icons/currency-icon.png",      // ← vlož cestu k obrázku packy
      },
    },
  ],
  xpProgressCurrent: 120,
  xpProgressMax:     200,
  onRetry:    () => console.log("retry"),
  onContinue: () => console.log("continue"),
};

// ── Komponenta ────────────────────────────────────────────────────────────────
export default function QuizResult({ data = mockResult }: { data?: QuizResultData }) {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 py-10 gap-6">

      {/* ── NADPIS ──────────────────────────────────────────────────── */}
      <div className="text-center">
        <h1
          className="cus-font-impacted-2 uppercase text-5xl sm:text-6xl md:text-7xl leading-tight tracking-widest"
          style={{ color: HEADING_COLOR }}
        >
          {data.title}
        </h1>
        <p className="text-gray-600 text-lg mt-1">{data.subtitle}</p>
      </div>

      {/* ── OBRÁZEK ZVÍŘETE ─────────────────────────────────────────── */}
      <div className="w-full max-w-sm md:max-w-md rounded-xl overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          <Image
            src={data.animalImageSrc}
            alt={data.animalImageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ── NÁZEV KVÍZU ─────────────────────────────────────────────── */}
      <h2
        className="cus-font-impacted-2 uppercase text-3xl sm:text-4xl text-center tracking-widest leading-tight"
        style={{ color: HEADING_COLOR }}
      >
        {data.quizName}
      </h2>

      {/* ── VÝSLEDKOVÁ KARTA ─────────────────────────────────────────── */}
      <div className="w-full max-w-sm md:max-w-md bg-[#f0ebe3] rounded-2xl p-4 flex flex-row gap-4 items-start">

        {/* Levý sloupec — medaile + XP */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <MedalCircle src={data.medalImageSrc} alt={data.medalImageAlt} />
          <p className="text-sm font-bold text-gray-700 mt-1">
            {data.medalXpCurrent}/{data.medalXpMax}
            <span className="text-green-600 font-extrabold ml-1">
              +{data.medalXpBonus}
            </span>
          </p>
        </div>

        {/* Pravý sloupec */}
        <div className="flex flex-col gap-2 flex-1">

          {/* Tři stat pilly */}
          <div className="flex flex-row">
            <StatPill
              iconSrc={"/img/icons/clock-icon-dark.png"}           
              value={data.timeLabel}
              bgColor={PILL_COLORS.time}
            />
            <StatPill
              iconSrc={"/img/icons/medal-icon-dark.png"}           
              value={`${data.xpGained} XP`}
              bgColor={PILL_COLORS.xp}
            />
            <StatPill
              iconSrc={data.pointsIconSrc}  
              value={String(data.pointsGained)}
              bgColor={PILL_COLORS.points}
            />
          </div>

          {/* Správné otázky */}
          <p className="font-extrabold text-gray-800 text-sm uppercase tracking-wide">
            {data.correctAnswers}/{data.totalQuestions} OTÁZEK
          </p>

          {/* Kategorie */}
          {data.categories.map((cat, i) => (
            <CategoryRow key={i} category={cat} />
          ))}

          {/* XP progress bar */}
          <div className="mt-1">
            <XpBar current={data.xpProgressCurrent} max={data.xpProgressMax} />
          </div>

        </div>
      </div>

      {/* ── TLAČÍTKA ─────────────────────────────────────────────────── */}
      <div className="flex flex-row gap-4 w-full max-w-sm md:max-w-md">

        {/* ZNOVU */}
        <button
          onClick={data.onRetry}
          className="flex-1 flex items-center justify-center gap-3 bg-[#6ABD83] hover:bg-green-600 active:scale-95 text-white cus-font-impacted-2 uppercase tracking-widest text-xl py-4 rounded-xl transition-all shadow-md"
        >
          {/* Placeholder kruh pro ikonu tlačítka ZNOVU — vlož src */}
          <IconCircle src={"/img/icons/loop-icon.png"} size={28} />
          ZNOVU
        </button>

        {/* POKRAČOVAT */}
        <button
          onClick={data.onContinue}
          className="flex-1 flex items-center justify-center gap-3 bg-[#6ABD83] hover:bg-green-600 active:scale-95 text-white cus-font-impacted-2 uppercase tracking-widest text-xl py-4 rounded-xl transition-all shadow-md"
        >
          {/* Placeholder kruh pro ikonu tlačítka POKRAČOVAT — vlož src */}
          <IconCircle src={"/img/icons/play-button.png"} size={24} />
          POKRAČOVAT
        </button>

      </div>
    </div>
  );
}

// ── Sub-komponenty ────────────────────────────────────────────────────────────

/** Kulatý rámeček s medailí */
function MedalCircle({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-24 h-24 rounded-full border-[6px] border-orange-400 overflow-hidden relative flex-shrink-0">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

/**
 * Placeholder kruh pro obrázek ikony.
 * Když src není definováno, zobrazí šedý kruh jako placeholder.
 * Až budeš mít obrázek, předej src="/img/icons/nazev.png"
 */
function IconCircle({ src, size = 32 }: { src?: string; size?: number }) {
  if (!src) {
    return (
      <div
        className="rounded-full bg-white/30 flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <Image src={src} alt="" fill className="object-contain" />
    </div>
  );
}

/**
 * Stat pill — čas / XP / body.
 * bgColor: nastav v PILL_COLORS nahoře.
 * iconSrc: vlož cestu k obrázku ikony (hodinky, blesk, packa).
 */
function StatPill({
  iconSrc,
  value,
  bgColor,
}: {
  iconSrc?: string;
  value: string;
  bgColor: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 text-white font-bold text-sm px-3 py-1.5 rounded-lg flex-1 justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <IconCircle src={iconSrc} size={20} />
      <span>{value}</span>
    </div>
  );
}

/** Řádek kategorie */
function CategoryRow({ category }: { category: QuizCategory }) {
  return (
    <div className="flex items-center gap-2">
      {/* Placeholder / obrázek ikony kategorie */}
      <IconCircle src={category.iconSrc} size={24} />

      <span className="font-extrabold text-gray-800 text-sm uppercase tracking-wide flex-shrink-0">
        {category.label}
      </span>

      {category.progress !== undefined && (
        <div className="flex-1 h-3 bg-gray-300 rounded-full overflow-hidden ml-1">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${category.progress}%` }}
          />
        </div>
      )}

      {category.badge && (
        <div className="ml-auto flex items-center gap-1 bg-green-500 text-white font-bold text-sm px-3 py-1 rounded-lg">
          <span>✓</span>
          <span>{category.badge.count}</span>
          {/* Placeholder / obrázek packy v odznaku */}
          <IconCircle src={category.badge.iconSrc} size={18} />
        </div>
      )}
    </div>
  );
}

/** XP progress bar */
function XpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min(Math.round((current / max) * 100), 100);
  return (
    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-gray-500 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}