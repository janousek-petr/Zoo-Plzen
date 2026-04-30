// components/QuizResult.tsx
import { Question } from "@/lib/types";

interface Props {
  score: number;
  totalPoints: number;
  questions: Question[];
}

export default function QuizResult({ score, totalPoints, questions }: Props) {
  const percentage = Math.round((score / totalPoints) * 100);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-2">Kvíz dokončen! 🎉</h1>
      <p className="text-5xl font-black mb-1">{score} / {totalPoints}</p>
      <p className="text-gray-400 mb-8">{percentage} % správně</p>

      <div className="w-full max-w-xl flex flex-col gap-3">
        {questions.map((q) => {
          const correct = q.answers.find(a => a.is_correct === 1);
          return (
            <div key={q.id} className="p-4 border rounded-xl text-sm">
              <p className="font-semibold mb-1">{q.text}</p>
              <p className="text-green-600">✓ {correct?.text}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}