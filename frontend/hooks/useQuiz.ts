import { useState, useEffect, useRef } from "react";
import { Question } from "@/lib/types";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useQuiz(questions: Question[]) {
  // Zamíchání otázek a odpovědí při startu
  const [shuffledQuestions] = useState(() =>
    shuffleArray(questions).map(q => ({
      ...q,
      answers: shuffleArray(q.answers),
    }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Set<number>>(new Set());
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Blokování tlačítka zpět
  useEffect(() => {
    history.pushState(null, "", location.href);
    const handlePopState = () => {
      history.pushState(null, "", location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (finished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [finished]);

  const currentQuestion = shuffledQuestions[currentIndex];
  const isLast = currentIndex === shuffledQuestions.length - 1;
  const progress = (currentIndex / shuffledQuestions.length) * 100;

  const handleOptionClick = (answerId: number) => {
    if (hasAnswered) return;
    const selected = currentQuestion.answers.find(a => a.id === answerId);
    if (selected?.is_correct === 1) {
      setScore(s => s + (currentQuestion.points ?? 0));
    }

    setSelectedAnswers(prev => {
      const newSet = new Set(prev);
      newSet.add(answerId);
      return newSet;
    });

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

  const timeLabel = `${Math.floor(elapsedSeconds / 60).toString().padStart(2, "0")}:${(elapsedSeconds % 60).toString().padStart(2, "0")}`;

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
    timeLabel,
    selectedAnswers
  };
}