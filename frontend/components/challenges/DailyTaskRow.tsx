import Image from "next/image";

export interface DailyTask {
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
    target?: number;
    regionName?: string;
}

export default function DailyTaskRow({ task }: { task: DailyTask }) {
    const formattedDescription = (task.description || "")
        .replace("{count}", String(task.target || 0))
        .replace("{region}", task.regionName || "Afrických");

    // Ověření platného HEX kódu nebo fallback
    const mainBg = task.bgColor?.startsWith("#") ? task.bgColor : "#5aab6e";
    const rewardBg = task.rewardBgColor?.startsWith("#")
        ? task.rewardBgColor
        : task.completed
            ? "#5aab6e"
            : "#f15a24";

    return (
        <div className="flex flex-row gap-3 w-full max-w-xl mx-auto">
            {/* Levý blok */}
            <div
                className="flex flex-row items-center gap-6 flex-1 px-6 py-4 rounded-2xl"
                style={{ backgroundColor: mainBg }}
            >
        <span className="cus-font-impacted-2 text-white text-7xl sm:text-8xl leading-none select-none">
          {task.order}
        </span>
                <div className="flex flex-col">
          <span className="cus-font-impacted-2 text-white uppercase text-2xl tracking-widest leading-tight">
            {task.title}
          </span>
                    <span className="text-white text-base mt-0.5">
            {formattedDescription} {task.completed && "✔️"}
          </span>
                </div>
            </div>

            {/* Pravý blok odměny */}
            <div
                className="flex flex-row items-center justify-center gap-3 px-6 py-4 rounded-2xl flex-shrink-0 min-w-[130px]"
                style={{ backgroundColor: rewardBg }}
            >
        <span className="relative w-12 h-12 block">
          <Image
              src={task.rewardIconSrc || "/img/icons/currency-icon.png"}
              alt={task.rewardIconAlt || "Tlapky"}
              fill
              className="object-contain"
          />
        </span>
                <span className="text-white font-extrabold text-4xl leading-none">{task.reward}</span>
            </div>
        </div>
    );
}