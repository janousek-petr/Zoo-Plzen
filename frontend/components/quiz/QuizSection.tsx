"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getQuizzesByRegion, startRandomQuiz } from "@/lib/api/quizzes";
import { RiLock2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { mixWithWhite, mixWithBlack } from "@/components/area/ColorPaletteGenerator";

const POINTS_TO_UNLOCK_SECOND = 400;
const POINTS_TO_UNLOCK_THIRD = 1000;

interface Props {
    regionId: number;
    quizHref: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
}

export default function QuizSection({ regionId, quizHref, primaryColor, secondaryColor, accentColor }: Props) {
    const { activeProfile } = useAuthContext();
    const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [hovered, setHovered] = useState<string | null>(null);
    const [loading, setLoading] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        getQuizzesByRegion(regionId, activeProfile?.id).then((data) => {
            if (data) {
                setTotalScore(data.region_score);

                const score = data.region_score ?? 0;
                const unlocked = [1];
                if (score >= POINTS_TO_UNLOCK_SECOND) unlocked.push(2);
                if (score >= POINTS_TO_UNLOCK_THIRD) unlocked.push(3);
                setUnlockedLevels(unlocked);
            }
        });
    }, [regionId, activeProfile?.id]);

    const handleStart = async (level: number) => {
        setLoading(level);
        try {
            const data = await startRandomQuiz(regionId, level);
            sessionStorage.setItem("active_quiz", JSON.stringify({...data, regionColor: primaryColor}));
            router.push(quizHref);
        } catch (err) {
            console.error("Nepodařilo se spustit kvíz:", err);
        } finally {
            setLoading(null);
        }
    };

    const hoverProps = (key: string, normal: string, hover: string) => ({
        style: { background: hovered === key ? hover : normal },
        onMouseEnter: () => setHovered(key),
        onMouseLeave: () => setHovered(null),
    });

    const nextMilestone = totalScore >= POINTS_TO_UNLOCK_THIRD
        ? POINTS_TO_UNLOCK_THIRD
        : totalScore >= POINTS_TO_UNLOCK_SECOND
        ? POINTS_TO_UNLOCK_THIRD
        : POINTS_TO_UNLOCK_SECOND;

    const progressPct = Math.min((totalScore / nextMilestone) * 100, 100);
    const remaining = Math.max(nextMilestone - totalScore, 0);

    return (
        <div className="w-full max-w-150">
            {/* Level tlačítka */}
            <div className="z-10 mt-10 flex h-20 w-full overflow-hidden rounded-3xl border-4">
                {[1, 2, 3].map((level, index) => {
                    const isUnlocked = unlockedLevels.includes(level);

                    if (!isUnlocked) {
                        return (
                            <div
                                key={level}
                                className={`flex flex-1 cursor-not-allowed items-center justify-center bg-gray-500 transition duration-200 ${index === 1 ? "border-x-2" : ""}`}
                            >
                                <RiLock2Fill size="36" />
                            </div>
                        );
                    }

                    return (
                        <button
                            key={level}
                            onClick={() => handleStart(level)}
                            disabled={loading === level}
                            className={`flex flex-1 cursor-pointer items-center justify-center text-black hover:text-gray-100 transition-colors duration-200 ${index === 1 ? "border-x-2" : ""} ${loading === level ? "opacity-60 cursor-wait" : ""}`}
                            {...hoverProps(`level-${level}`, primaryColor, accentColor)}
                        >
                            <p className="text-4xl font-bold">
                                {loading === level ? "..." : level}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Progress */}
            <div className="mt-6 flex flex-col gap-3 uppercase">
                <div className="flex sm:flex-row flex-col gap-3">
                    <div
                        className="flex flex-col p-4 rounded-xl shadow-md flex-1"
                        style={{ background: mixWithWhite(primaryColor, 0.2) }}
                    >
                        <span className="cus-font-impacted-2 text-sm" style={{ color: mixWithBlack(primaryColor, 0.3) }}>Tvé skóre</span>
                        <span className="cus-font-impacted-2 text-6xl" style={{ color: mixWithBlack(primaryColor, 0.7) }}>{totalScore}</span>
                        <span className="text-xs" style={{ color: mixWithBlack(primaryColor, 0.3) }}>v tomto regionu</span>
                    </div>

                    <div
                        className="flex flex-col p-4 rounded-xl shadow-md flex-1 text-right"
                        style={{ background: mixWithWhite(primaryColor, 0.2) }}
                    >
                        <span className="cus-font-impacted-2 text-sm" style={{ color: mixWithBlack(primaryColor, 0.3) }}>
                            {totalScore >= POINTS_TO_UNLOCK_THIRD ? "Max level!" : "Do dalšího levelu"}
                        </span>
                        <span className="cus-font-impacted-2 text-6xl" style={{ color: mixWithBlack(primaryColor, 0.7) }}>
                            {totalScore >= POINTS_TO_UNLOCK_THIRD ? "MAX!" : remaining}
                        </span>
                        <span className="text-xs" style={{ color: mixWithBlack(primaryColor, 0.3) }}>
                            {totalScore >= POINTS_TO_UNLOCK_THIRD ? "Dosaženo nejtěžší úrovně" : "Zbývá bodů"}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="rounded-xl p-4 shadow-md" style={{ background: mixWithWhite(primaryColor, 0.2) }}>
                    <div className="flex justify-between text-xs mb-2" style={{ color: mixWithBlack(primaryColor, 0.3) }}>
                        <span className="cus-font-impacted-2">Postup k dalšímu levelu</span>
                        <span>{totalScore} / {nextMilestone}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: mixWithWhite(primaryColor, 0.5) }}>
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${progressPct}%`, background: mixWithBlack(primaryColor, 0.55) }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs" style={{ color: mixWithBlack(primaryColor, 0.3) }}>
                        <span>0</span>
                        <span>400</span>
                        <span>1000</span>
                    </div>
                </div>
            </div>
        </div>
    );
}