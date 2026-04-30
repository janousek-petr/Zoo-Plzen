// hooks/useQuiz.ts
import { useState } from "react";
import { Question } from "@/lib/types"; // nebo kde máš typy

export function useQuiz(questions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleOptionClick = (answerId: number) => {
    if (hasAnswered) return;

    const selected = currentQuestion.answers.find(a => a.id === answerId);
    if (selected?.is_correct === 1) {
      setScore(s => s + (currentQuestion.points ?? 0));
    }

    setSelectedId(answerId);
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedId(null);
    setHasAnswered(false);
  };

  const correctAnswerId = currentQuestion?.answers.find(a => a.is_correct === 1)?.id ?? null;

  return {
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
  };
}