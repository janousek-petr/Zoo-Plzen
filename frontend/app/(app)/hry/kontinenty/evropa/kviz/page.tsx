"use client";

import { useEffect, useState } from "react";
import QuizEngine from "@/components/quiz/QuizEngine";
import { getHrefName } from "@/components/area/ContinentArea";

export default function QuizPage() {
    const [quizData, setQuizData] = useState<any>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem("active_quiz");
        if (raw) setQuizData(JSON.parse(raw));
    }, []);

    if (!quizData) return <p>Načítání kvízu...</p>;

    return (
        <QuizEngine
            questions={quizData.questions}
            totalPoints={quizData.quiz_meta.total_points}
            regionName={quizData.quiz_meta.region.name}
            regionColor={quizData.regionColor}
            level={quizData.quiz_meta.level}
            quizId={quizData.quiz_meta.id}
            exitHref={"/hry/kontinenty/" + getHrefName(quizData.quiz_meta.region.name) + "#kviz-sekce"}
        />
    );
}