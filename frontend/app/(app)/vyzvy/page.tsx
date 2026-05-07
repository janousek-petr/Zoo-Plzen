import Image from "next/image";

// ── Typy ─────────────────────────────────────────────────────────────────────

interface WeeklyChallenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  reward: number;
  rewardIconSrc: string;
  rewardIconAlt: string;
  animalSrc: string;
  animalAlt: string;
  animalSide: "left" | "right";
  bgColor: string;
  textColor: string;
}

interface DailyTask {
  id: number;
  order: number;
  orderIconSrc: string;
  orderIconAlt: string;
  category: string;
  description: string;
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

// ── Simulace dat ─────────────────────────────────────────────────────────────

const mockData: ChallengesData = {
  weeklyChallenges: [
    {
      id: 1,
      title: "LVÍ JÁMA",
      description: "Odpověz správně na 7 Afrických otázek",
      progress: 55,
      reward: 15,
      rewardIconSrc: "/img/icons/currency-icon.png",
      rewardIconAlt: "Tlapky",
      animalSrc: "/img/photo-no-bg/lion.png",
      animalAlt: "Lev",
      animalSide: "right",
      bgColor: "bg-[#e8d5b7]",
      textColor: "text-[#7a4a1e]",
    },
    {
      id: 2,
      title: "TYGŘÍ LOV",
      description: "Vylepši si odznáček u jakéhokoli regionu",
      progress: 30,
      reward: 20,
      rewardIconSrc: "/img/icons/currency-icon.png",
      rewardIconAlt: "Tlapky",
      animalSrc: "/img/photo-no-bg/tiger-turnt.png",
      animalAlt: "Tygr",
      animalSide: "left",
      bgColor: "bg-[#f5c98a]",
      textColor: "text-[#c46a00]",
    },
    {
      id: 3,
      title: "LESNÍ POMOCNÍK",
      description: "Doplň lesní kvíz a získej odměnu",
      progress: 0,
      reward: 15,
      rewardIconSrc: "/img/icons/currency-icon.png",
      rewardIconAlt: "Tlapky",
      animalSrc: "/img/photo-no-bg/bear.png",
      animalAlt: "Medvěd",
      animalSide: "right",
      bgColor: "bg-[#9e9e9e]",
      textColor: "text-white",
    },
  ],
  renewsInHours: 7,
  renewIconSrc: "/img/icons/hourglass-icon.png",
  renewIconAlt: "Přesýpací hodiny",
  dailyTasks: [
    {
      id: 1,
      order: 1,
      orderIconSrc: "/img/icons/number-1.png",
      orderIconAlt: "1",
      category: "PŘÍRODOVĚDEC",
      description: "Odpověz správně na 20 otázek",
      reward: 5,
      rewardIconSrc: "/img/icons/currency-icon.png",
      rewardIconAlt: "Tlapky",
      bgColor: "bg-[#5aab6e]",
      rewardBgColor: "bg-[#f15a24]",
    },
    {
      id: 2,
      order: 2,
      orderIconSrc: "/img/icons/number-2.png",
      orderIconAlt: "2",
      category: "SAFARI",
      description: "Úspěšně splň \"Lví jámu\" v Africe.",
      reward: 5,
      rewardIconSrc: "/img/icons/currency-icon.png",
      rewardIconAlt: "Tlapky",
      bgColor: "bg-[#5aab6e]",
      rewardBgColor: "bg-[#f15a24]",
    },
  ],
};

// ── Komponenta ────────────────────────────────────────────────────────────────

export default function ChallengesPage({ data = mockData }: { data?: ChallengesData }) {
  return (
    <main className="w-full bg-white">

      {/* ── TÝDENNÍ VÝZVY nadpis ────────────────────────────────────── */}
      <div className="flex justify-center pt-12 pb-28 bg-white relative z-0">
        <h1 className="cus-font-impacted-2 uppercase text-green-700 text-4xl sm:text-5xl md:text-6xl tracking-widest text-center">
          Týdenní výzvy
        </h1>
      </div>

      {/* ── VÝZVY ───────────────────────────────────────────────────── */}
      <section className="relative">
        {data.weeklyChallenges.map((challenge, index) => (
          <div
            key={challenge.id}
            className="bg-white relative"
            style={{ 
                paddingTop: index === 0 ? 0 : 120, // Větší mezera mezi zvířaty
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
      <div className="flex justify-center py-8 bg-white">
        <h2 className="cus-font-impacted-2 uppercase text-green-700 text-4xl sm:text-5xl tracking-widest text-center">
          Denní úkoly
        </h2>
      </div>

      {/* ── DENNÍ ÚKOLY ─────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 px-4 pb-12 bg-white">
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
  
  // Specifické nastavení výšky pro medvěda, aby se nedotýkal, ale seděl dole
  const isBear = challenge.id === 3;
  const animalHeight = isBear ? "115%" : "150%"; 

  return (
    <div
      className={`relative w-full overflow-visible flex items-center px-5 sm:px-16 md:px-24 ${challenge.bgColor} ${
        isRight ? "justify-start" : "justify-end"
      }`}
      style={{ height: "280px" }}
    >
      <Image
        src={challenge.animalSrc}
        alt={challenge.animalAlt}
        className={`absolute bottom-0 w-auto object-bottom z-0 select-none pointer-events-none ${
          isRight ? "right-0" : "left-0 scale-x-[-1]"
        }`}
        style={{ height: animalHeight, maxWidth: "none" }}
        draggable={false}
        width={600} // Zvětšeno pro větší render
        height={600}
        priority
      />

      <div className={`relative z-10 max-w-[55%] sm:max-w-sm ${challenge.textColor}`}>
        <h2 className="cus-font-impacted-2 uppercase text-4xl sm:text-5xl md:text-6xl leading-tight">
          {challenge.title}
        </h2>

        <p className="text-base sm:text-lg mt-1">
          {challenge.description}
        </p>

        <div className="mt-3 w-full max-w-[220px]">
          <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B4513] rounded-full"
              style={{ width: `${challenge.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="relative w-12 h-12 flex-shrink-0 block">
            <Image src={challenge.rewardIconSrc} alt={challenge.rewardIconAlt} fill className="object-contain" />
          </span>
          <span className="cus-font-impacted-2 text-4xl">{challenge.reward}</span>
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
      <div className={`flex flex-row items-center gap-6 flex-1 px-6 py-4 rounded-2xl ${task.bgColor}`}>
        <span className="cus-font-impacted-2 text-white text-7xl sm:text-8xl leading-none select-none">
          {task.order}
        </span>
        <div className="flex flex-col">
          <span className="cus-font-impacted-2 text-white uppercase text-2xl tracking-widest leading-tight">
            {task.category}
          </span>
          <span className="text-white text-base mt-0.5">{task.description}</span>
        </div>
      </div>

      {/* Pravý blok */}
      <div className={`flex flex-row items-center justify-center gap-3 px-6 py-4 rounded-2xl ${task.rewardBgColor} flex-shrink-0 min-w-[130px]`}>
        <span className="relative w-12 h-12 block">
          <Image src={task.rewardIconSrc} alt={task.rewardIconAlt} fill className="object-contain" />
        </span>
        <span className="text-white font-extrabold text-4xl leading-none">{task.reward}</span>
      </div>

    </div>
  );
}