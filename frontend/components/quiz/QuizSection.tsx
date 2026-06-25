"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getQuizzesByRegion } from "@/lib/api/quizzes";
import { RiLock2Fill, RiLoaderLine } from "react-icons/ri";
import Link from "next/link";

const POINTS_TO_UNLOCK_SECOND = 400;
const POINTS_TO_UNLOCK_THIRD = 1000;

interface Props {
    regionId: number;
    quizHref: string;
}

export default function QuizSection({ regionId, quizHref }: Props) {
    const { activeProfile } = useAuthContext();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
    const [pointsPerLevel, setPointsPerLevel] = useState<Record<number, number>>({});
    const [totalScore, setTotalScore] = useState();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getQuizzesByRegion(regionId, activeProfile?.id).then((data) => {
            if (data) {
                setQuizzes(data.quizzes);
                //setUnlockedLevels(data.unlocked_levels);
                //setPointsPerLevel(data.points_per_level ?? {});
                setTotalScore(data.total_score);
                setLoading(false);
                console.log(data);
                console.log(totalScore);
            }
        });
    }, [regionId, activeProfile?.id]);

    return (
        <div className="w-full max-w-150">
            {/* Level tlačítka */}
            <div className="z-10 mt-10 flex h-20 w-full overflow-hidden rounded-3xl border-4">
                {[1, 2, 3].map((level, index) => {
                    const quiz = quizzes?.find((q: any) => q.level === level);
                    const isUnlocked = unlockedLevels.includes(level);

                    if (!isUnlocked || !quiz) {
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
                        <Link
                            key={level}
                            href={`${quizHref}/${quiz.id}`}
                            className="flex flex-1 cursor-pointer items-center justify-center bg-[#BD9554]/70 hover:bg-[#BD9554] text-black hover:text-gray-100 transition duration-200"
                        >
                            <p className="text-4xl font-bold">{level}</p>
                        </Link>
                    );
                    
                })}
            </div>

            {/* Progress */}
            <div className="mt-6 flex sm:flex-row flex-col gap-4 uppercase justify-between">
                <div className="bg-[#BD9554]/70 flex flex-col p-4 rounded-lg shadow-md">
                    <span className="cus-font-impacted-2 text-xl">Tvé skóre v tomto regionu</span> 
                    <span className="cus-font-impacted-2 text-7xl">{totalScore}</span>
                </div>

                <div className="bg-[#BD9554]/70 flex flex-col p-4 rounded-lg text-end shadow-md">
                    <span className="cus-font-impacted-2 text-xl">Skóre k odemknutí další úrovně</span> 
                    <span className="cus-font-impacted-2 text-7xl">{totalScore}</span>
                </div>
            </div>
        </div>
    );
}