import { getQuestions } from "@/lib/api/questions";
import { getQuizInfo } from "@/lib/api/quizzes";
import { Quiz } from "@/lib/types";
import QuizEngine from "@/components/quiz/QuizEngine";

const QUIZ_ID = 1; // nebo dynamicky z params pokud máš [id]

export default async function QuizPage() {
  const [questions, quizList] = await Promise.all([
    getQuestions(QUIZ_ID),
    getQuizInfo(),
  ]);

  const quiz: Quiz = quizList.find((q: Quiz) => q.id === QUIZ_ID);

  if (!questions || !quiz) {
    return <p>Kvíz nenalezen.</p>;
  }

  return (
    <QuizEngine
      questions={questions}
      totalPoints={Number(quiz.total_points ?? 0)}
    />
  );
}