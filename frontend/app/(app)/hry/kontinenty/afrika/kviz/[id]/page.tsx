import { getQuestions, getQuiz } from "@/lib/api/quizzes";
import QuizEngine from "@/components/quiz/QuizEngine";

interface Props {
    params: Promise<{ id: string }>
}

export default async function QuizPage({ params }: Props) {
    const { id } = await params;
    const quizId = Number(id);
    const questions = await getQuestions(quizId);
    const quiz = await getQuiz(quizId);
    

    if (!questions || questions.length === 0) {
        return <p>Kvíz nenalezen nebo nemá otázky.</p>;
    }

    return (
        <QuizEngine
            questions={questions}
            totalPoints={quiz.total_points}
            regionName={quiz.region.name}
            regionColor="#BD9554"
            level={quiz.level}
            quizId={quizId}
        />    
    );
}