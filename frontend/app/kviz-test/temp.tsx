'use client';

import { useState, useMemo, useEffect } from 'react';
import QuizText from '@/components/ui/QuizText';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  image: string;
}

interface ShuffledOption {
  text: string;
  isCorrect: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function QuizEngine() {
  // --- NOVÉ: Stav pro prevenci Hydration erroru ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. STATICKÁ DATA
  const [questions] = useState<Question[]>([
    {
      id: 1,
      question: "Jaké zvíře je na obrázku?",
      options: ["Tygr", "Lev", "Jaguár"],
      correctAnswer: 0,
      image: "/img/photo/image-1.jpg"
    },
    {
      id: 2,
      question: "Jaké zvíře je na obrázku?",
      options: ["Lev", "Tygr", "Jaguár"],
      correctAnswer: 0,
      image: "/img/photo/image-2.jpg"
    }
  ]);

  // 2. STAV KVÍZU
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  // 3. MÍCHÁNÍ (Bezpečné díky isMounted)
  const shuffledOptions = useMemo(() => {
    if (!currentQ) return [];

    const optionsWithMeta: ShuffledOption[] = currentQ.options.map((text, idx) => ({
      text,
      isCorrect: idx === currentQ.correctAnswer
    }));

    return shuffleArray(optionsWithMeta);
  }, [currentQ]);

  // 4. LOGIKA VYHODNOCENÍ
  const handleAnswer = (selectedIdx: number) => {
    const selectedOption = shuffledOptions[selectedIdx];

    if (selectedOption.isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // --- NOVÉ: Zabráníme serveru renderovat cokoliv náhodného ---
  // Dokud nejsme plně na klientovi, nevykreslujeme nic (nebo můžeš vrátit loading spinner)
  if (!isMounted) {
    return null; 
  }

  // 5. FINÁLNÍ OBRAZOVKA
  if (isFinished) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-white">
        <h2 className="text-5xl font-black mb-2 text-black">HOTOVO!</h2>
        <p className="text-2xl mb-8 font-bold text-red-600 uppercase">
          Tvé skóre: {score} / {questions.length}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-black text-white px-12 py-4 rounded-full font-bold uppercase transition hover:scale-105 shadow-xl"
        >
          Hrát znovu
        </button>
      </div>
    );
  }

  if (shuffledOptions.length === 0) return null;

  return (
    <QuizText 
      data={{
        question: currentQ.question,
        image: currentQ.image,
        options: shuffledOptions.map(opt => opt.text) 
      }}
      onAnswer={handleAnswer}
      currentLevel={currentIndex + 1}
      totalLevels={questions.length}
    />
  );
}