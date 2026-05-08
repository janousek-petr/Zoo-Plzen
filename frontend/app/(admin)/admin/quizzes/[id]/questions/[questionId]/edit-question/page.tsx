import Header from '@/components/admin/Header'
import EditQuestion from "@/components/admin/EditQuestion"
import { getQuestion } from '@/lib/api/quizzes'

export default async function EditQuestionPage({ 
    params 
}: { 
    params: Promise<{ id: string, questionId: string }> 
}) {
    const { id, questionId } = await params
    const question = await getQuestion(Number(id), Number(questionId))

    return (
        <>
            <Header title='Upravit otázku' href={`/admin/quizzes/${id}/questions`}/>
            <div className="p-6">
                <EditQuestion quizId={Number(id)} question={question}/>
            </div>
        </>
    )
}