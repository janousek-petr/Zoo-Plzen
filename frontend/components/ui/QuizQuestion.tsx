/*'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Definice rozhraní pro data, která tato komponenta očekává
interface QuizTextProps {
  data: {
    question: string;
    options: string[];
    image: string;
  };
  onAnswer: (selectedIdx: number) => void;
  currentLevel: number;
  totalLevels: number;
}

export default function QuizText({ data, onAnswer, currentLevel, totalLevels }: QuizTextProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null); // Reset výběru pro další otázku v enginu
    }
  };

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden p-4 md:p-8">
      {/* Header }
      <header className="flex flex-col items-center mb-2 shrink-0">
        <h1 className="text-red-600 text-3xl md:text-6xl uppercase text-center cus-font-impacted-2">
          Jméno oblasti
        </h1>
        <p className="text-red-600 text-xl md:text-3xl text-center font-medium">
          Level {currentLevel} / {totalLevels}
        </p>
      </header>

      {/* Image Container - flex-1 zajistí, že se obrázek přizpůsobí výšce displeje }
      <section className="flex-1 relative w-full min-h-0 my-4 flex justify-center items-center rounded-2xl overflow-hidden bg-gray-50">
        <Image
          src={data.image}
          alt="Kvízový obrázek"
          fill
          className="object-contain p-2"
          draggable={false}
          priority
        />
      </section>

      {/* Otázka a odpovědi }
      <footer className="w-full max-w-4xl mx-auto shrink-0">
        <p className="text-xl md:text-2xl font-bold text-center mb-4 leading-tight">
          {data.question}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedAnswer(index)}
              className={`py-3 md:py-5 px-4 transition-all border-2 font-bold text-lg rounded-xl
                ${selectedAnswer === index 
                  ? "bg-red-600 text-white border-red-700 shadow-md scale-[1.02]" 
                  : "bg-gray-100 text-black border-transparent hover:bg-gray-200"}
              `}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`w-full py-4 mt-4 font-bold uppercase transition-all text-xl rounded-xl
            ${selectedAnswer !== null 
              ? "bg-black text-white cursor-pointer hover:bg-zinc-800" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          `}
        >
          Pokračovat
        </button>
      </footer>
    </main>
  );
}*/


import Image from "next/image";
import { useState } from "react";

interface Option {
  id: number;
  text: string;
}

interface QuestionData {
  id: number;
  question: string;
  image: string | null;
  type: string;
  options: Option[];
  correct_id: number;
}

interface QuizQuestionProps {
  data: QuestionData;
  onAnswer: (selectedId: number) => void;
  currentLevel: number;
  totalLevels: number;
  areaName: string;
}

export default function QuizQuestion({ data, onAnswer, currentLevel, totalLevels, areaName }: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false); // Nový stav pro zamknutí a barvy

  const handleOptionClick = (optionId: number) => {
    if (hasAnswered) return; // Pokud už odpověděl, nic nedělej
    
    setSelectedId(optionId);
    setHasAnswered(true); // Okamžitě po kliku ukážeme barvy
  };

  const handleNext = () => {
    if (selectedId !== null) {
      onAnswer(selectedId);
      setSelectedId(null);
      setHasAnswered(false); // Reset pro další otázku
    }
  };

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden px-4 md:px-8">
      {/* ... Header stejný ... */}

      {/* Image Container */}
      <section className="relative w-full my-4 flex justify-center items-center rounded-2xl overflow-hidden">
        <Image src={data.image} alt="Kvíz" width={600} height={600} className="object-contain p-2" priority />
      </section>

      {/* Otázka a odpovědi */}
      <footer className="w-full max-w-4xl mx-auto shrink-0">
        <p className="text-xl md:text-2xl text-center mb-4 leading-tight">{data.question}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.options.map((option) => {
            // Logika barev:
            let buttonStyle = "bg-gray-100 text-black border-transparent hover:bg-gray-200";
            
            if (hasAnswered) {
              if (option.id === data.correct_id) {
                // Správná odpověď bude vždy zelená
                buttonStyle = "bg-green-500 text-white border-green-600 shadow-md";
              } else if (option.id === selectedId) {
                // Pokud uživatel klikl na špatnou, bude červená
                buttonStyle = "bg-red-600 text-white border-red-700 shadow-md";
              } else {
                // Ostatní špatné zešednou víc
                buttonStyle = "bg-gray-100 text-gray-400 border-transparent opacity-50";
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option.id)}
                disabled={hasAnswered} // Zabrání změně po kliknutí
                className={`py-3 md:py-5 px-4 transition-all border-2 font-bold text-lg rounded-xl ${buttonStyle}`}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`w-full py-4 mt-4 font-bold uppercase transition-all text-xl rounded-xl
            ${hasAnswered ? "bg-black text-white cursor-pointer hover:bg-zinc-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          `}
        >
          Pokračovat
        </button>
      </footer>
    </main>
  );
}