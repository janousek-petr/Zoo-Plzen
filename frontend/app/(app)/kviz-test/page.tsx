"use client"

import { useState } from 'react';
import QuizQuestion from '@/components/ui/QuizQuestion';

export default function QuizEngine() {
    const quizData = [
        {
            id: 1,
            question: "Jaké zvíře je na obrázku?",
            image: "/img/photo/image-1.jpg",
            type: "image_question",
            options: [
            { id: 89, text: "Jaguár" },
            { id: 12, text: "Tygr" },
            { id: 45, text: "Lev" }
            ],
            correct_id: 12
        },
        {
            id: 2,
            question: "Které město je hlavní město České republiky?",
            image: null,
            type: "text_only",
            options: [
            { id: 210, text: "Brno" },
            { id: 211, text: "Ostrava" },
            { id: 212, text: "Praha" }
            ],
            correct_id: 212
        },
        {
            id: 3,
            question: "Která planeta je nejblíže Slunci?",
            image: "/img/photo/image-2.jpg",
            type: "text_only",
            options: [
            { id: 305, text: "Venuše" },
            { id: 306, text: "Merkur" },
            { id: 307, text: "Mars" },
            ],
            correct_id: 306
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Funkce, kterou zavoláme z vnitřní komponenty
    const handleAnswer = (selectedId) => {
        const currentQuestion = quizData[currentIndex];

        // 1. Přičtení bodu, pokud je to správně
        if (selectedId === currentQuestion.correct_id) {
            setScore(prev => prev + 1);
        }

        // 2. Posun na další otázku nebo konec
        const nextIndex = currentIndex + 1;
        if (nextIndex < quizData.length) {
            setCurrentIndex(nextIndex);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <div className="text-center p-10">
                <h1 className="text-3xl font-bold">Dokončil jsi kvíz!</h1>
                <p className="text-xl mt-4">Tvoje skóre: {score} z {quizData.length}</p>
                <button 
                    onClick={() => window.location.reload()} // Jednoduchý restart
                    className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg"
                >
                    Zkusit znovu
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="mt-16">
                <h1 className="uppercase cus-font-impacted-2 text-6xl text-center">Oblast</h1>
                <p className="text-3xl text-center">Level</p>
            </div>
            <div className="container mx-auto p-4">
                <QuizQuestion 
                    data={quizData[currentIndex]} 
                    onAnswer={handleAnswer} 
                />
                <div className="mt-4 text-gray-500 text-center">
                    Otázka {currentIndex + 1} z {quizData.length}
                </div>
            </div>
        </>
    );
}