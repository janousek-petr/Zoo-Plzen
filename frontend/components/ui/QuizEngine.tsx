// components/QuizEngine.tsx
"use client";

import Image from "next/image";
import { Question } from "@/lib/types";
import { useQuiz } from "@/hooks/useQuiz";
import QuizResult from "./QuizResult";

interface Props {
  questions: Question[];
  totalPoints: number;
}

export default function QuizEngine({ questions, totalPoints }: Props) {
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
  } = useQuiz(questions);

  if (finished) {
    return <QuizResult score={score} totalPoints={totalPoints} questions={questions} />;
  }

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden px-4 md:px-8">

      {/* Progress + info */}
      <header className="w-full max-w-4xl mx-auto pt-4 shrink-0">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Otázka {currentIndex + 1} / {questions.length}</span>
          {currentQuestion.category && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {currentQuestion.category.name}
            </span>
          )}
          <span>{currentQuestion.points} bodů</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Obrázek */}
      {currentQuestion.image && (
        <section className="relative w-full my-4 flex justify-center items-center rounded-2xl overflow-hidden flex-1 min-h-0">
          <Image
            src={currentQuestion.image}
            alt="Kvíz"
            fill
            className="object-contain p-2"
            priority
          />
        </section>
      )}

      {/* Otázka + odpovědi */}
      <footer className="w-full max-w-4xl mx-auto shrink-0 pb-4">
        <p className="text-xl md:text-2xl text-center mb-4 leading-tight">
          {currentQuestion.text}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentQuestion.answers.map((answer) => {
            let buttonStyle = "bg-gray-100 text-black border-transparent hover:bg-gray-200";

            if (hasAnswered) {
              if (answer.id === correctAnswerId) {
                buttonStyle = "bg-green-500 text-white border-green-600 shadow-md";
              } else if (answer.id === selectedId) {
                buttonStyle = "bg-red-600 text-white border-red-700 shadow-md";
              } else {
                buttonStyle = "bg-gray-100 text-gray-400 border-transparent opacity-50";
              }
            }

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => answer.id && handleOptionClick(answer.id)}
                disabled={hasAnswered}
                className={`py-3 md:py-5 px-4 transition-all border-2 font-bold text-lg rounded-xl ${buttonStyle}`}
              >
                {answer.text}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`w-full py-4 mt-4 font-bold uppercase transition-all text-xl rounded-xl
            ${hasAnswered
              ? "bg-black text-white cursor-pointer hover:bg-zinc-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {isLast ? "Zobrazit výsledek" : "Pokračovat"}
        </button>
      </footer>
    </main>
  );
}