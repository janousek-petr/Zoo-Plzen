import { getQuestions } from "@/lib/api/quizzes";
import QuizEngine from "@/components/quiz/QuizEngine";

interface Props {
    params: Promise<{ id: string }>
}

export default async function QuizPage({ params }: Props) {
    const { id } = await params;
    const quizId = Number(id);
    const questions = await getQuestions(quizId);

    if (!questions || questions.length === 0) {
        return <p>Kvíz nenalezen nebo nemá otázky.</p>;
    }

    const totalPoints = questions.reduce(
        (sum: number, q: any) => sum + (q.points ?? 0), 0
    );

    return (
        <QuizEngine
            questions={questions}
            totalPoints={totalPoints}
            regionName="Etiopská oblast"
            regionColor="#BD9554"
            level={1}
        />    
    );
}