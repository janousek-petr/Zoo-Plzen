"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import { useQuiz } from "@/hooks/useQuiz";
import QuizResult from "./QuizResult";
import QuizIntro from "./QuizIntro";
import { FiLogOut } from "react-icons/fi";

interface Props {
  questions: Question[];
  totalPoints: number;
  regionName?: string;
  regionColor?: string;
  level?: number;
  quizId?: number;
  exitHref?: string;
}

export default function QuizEngine({
  questions,
  totalPoints,
  regionName = "Oblast",
  regionColor = "#BD9554",
  level = 1,
  quizId,
  exitHref = "/hry/oblasti/etiopska-oblast",
}: Props) {
  const [started, setStarted] = useState(false);
  const router = useRouter();

  const {
    currentQuestion,
    currentIndex,
    selectedId,
    hasAnswered,
    score,
    finished,
    progress,
    isLast,
    correctAnswerId,
    handleOptionClick,
    handleNext,
    timeLabel,
  } = useQuiz(questions);

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
    const imgUrl = (path: string | null | undefined) =>
        path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null

  if (!started) {
    return (
      <QuizIntro
        regionName={regionName}
        regionColor={regionColor}
        level={level}
        questionCount={questions.length}
        exitHref={exitHref}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (finished) {
    return (
      <QuizResult
        score={score}
        totalPoints={totalPoints}
        questions={questions}
        regionName={regionName}
        regionColor={regionColor}
        level={level}
        quizId={quizId}
        timeLabel={timeLabel}
      />
    );
  }

  const questionType = currentQuestion.category?.name ?? "select";

  return (
    <main className="min-h-screen w-full flex flex-col items-center px-4 overflow-hidden py-10">

      {/* Header */}
      <header className="w-full max-w-sm pt-6 pb-2 text-center shrink-0">
        <h1
          className="cus-font-impacted-2 uppercase text-5xl"
          style={{ color: regionColor }}
        >
          {regionName}
        </h1>
        <p
          className="text-3xl tracking-widest uppercase mt-0.5"
          style={{ color: regionColor }}
        >
          - Level {level} -
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: regionColor }}
          />
        </div>
      </header>

      {/* Obrázek — jen když existuje */}
      {questionType !== "image_select" && currentQuestion.image && (
        <div className="relative w-full max-w-sm h-56 my-4 shrink-0">
          <Image
            src={imgUrl(currentQuestion.image)!}
            alt="Zvíře"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      {/* Spacer — když není obrázek */}
      {questionType !== "image_select" && !currentQuestion.image && (
        <div />
      )}

      {/* Otázka */}
      <p className="text-center text-3xl max-w-sm mb-4 px-2 cus-font-impacted my-4">
        {currentQuestion.text}
      </p>

      {/* === select === */}
      {questionType === "select" && (
        <div className="flex flex-col gap-3 w-full max-w-sm shrink-0 my-4">
          {currentQuestion.answers.map((answer) => {
            const isCorrect = answer.id === correctAnswerId;
            const isSelected = answer.id === selectedId;

            let bg = "bg-[#f0ece4] text-gray-700";
            let dot = "bg-gray-300";

            if (hasAnswered) {
              if (isCorrect) { bg = "bg-green-700 text-white"; dot = "bg-white"; }
              else if (isSelected) { bg = "bg-red-600 text-white"; dot = "bg-white"; }
              else { bg = "bg-[#f0ece4] text-gray-400 opacity-60"; }
            }

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => answer.id && handleOptionClick(answer.id)}
                disabled={hasAnswered}
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-left transition-all text-lg ${bg} ${!hasAnswered ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className={`w-4 h-4 rounded-full shrink-0 border-2 border-white shadow ${dot}`} />
                {answer.text}
              </button>
            );
          })}
        </div>
      )}

      {/* === true_false === */}
      {questionType === "true_false" && (
        <div className="flex gap-4 w-full max-w-sm shrink-0 my-4">
          {currentQuestion.answers.map((answer) => {
            const isCorrect = answer.id === correctAnswerId;
            const isSelected = answer.id === selectedId;

            let bg = "bg-[#f0ece4] text-gray-700";

            if (hasAnswered) {
              if (isCorrect) bg = "bg-green-700 text-white";
              else if (isSelected) bg = "bg-red-600 text-white";
              else bg = "bg-[#f0ece4] text-gray-400 opacity-60";
            }

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => answer.id && handleOptionClick(answer.id)}
                disabled={hasAnswered}
                className={`flex-1 py-7 text-2xl font-bold rounded-2xl transition-all ${bg} ${!hasAnswered ? "cursor-pointer" : "cursor-default"}`}
              >
                {answer.text}
              </button>
            );
          })}
        </div>
      )}

      {/* === image_select === */}
      {questionType === "image_select" && (
        <div className="grid grid-cols-3 gap-3 w-full max-w-3xl shrink-0 my-4">
          {currentQuestion.answers.map((answer) => {
            const isCorrect = answer.id === correctAnswerId;
            const isSelected = answer.id === selectedId;

            let border = "border-transparent";
            let opacity = "";

            if (hasAnswered) {
              if (isCorrect) border = "border-green-700";
              else if (isSelected) border = "border-red-600";
              else opacity = "opacity-40";
            }

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => answer.id && handleOptionClick(answer.id)}
                disabled={hasAnswered}
                className={`relative rounded-2xl overflow-hidden border-4 bg-white shadow-sm transition-all ${border} ${opacity} ${!hasAnswered ? "cursor-pointer" : "cursor-default"}`}
                style={{ aspectRatio: "3/4" }}
              >
                {answer.image && (
                  <Image
                    src={imgUrl(answer.image)!}
                    alt={answer.text ?? ""}
                    fill
                    className="object-contain p-2"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Pokračovat */}
      {hasAnswered && (
        <button
          type="button"
          onClick={handleNext}
          className="mt-4 px-10 py-3 font-bold uppercase cursor-pointer tracking-widest text-lg rounded-md transition-all text-white shrink-0"
          style={{ backgroundColor: regionColor }}
        >
          {isLast ? "Zobrazit výsledek" : "Pokračovat"}
        </button>
      )}

      {/* Ikonky */}
      <div className="flex gap-4 pb-4 shrink-0 mt-auto">
        <button
          onClick={() => router.push(exitHref)}
          className="w-10 h-10 rounded-lg border-2 bg-red-500 flex items-center justify-center text-white hover:text-red-500 hover:border-red-400 hover:bg-transparent transition-all cursor-pointer"
          aria-label="Odejít z kvízu"
        >
          <FiLogOut size={18} />
        </button>
        <button className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold text-lg">
          ?
        </button>
      </div>

    </main>
  );
}