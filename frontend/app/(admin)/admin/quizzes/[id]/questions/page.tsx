import Header from '@/components/admin/Header'
import QuestionEditList from "@/components/admin/QuestionEditList"

export default async function QuestionsListPage({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params

    return(
        <>
            <Header title='Správa otázek' href={`/admin/quizzes/${id}`}/>

            <div className="p-6">
                <QuestionEditList quizId={Number(id)} />
            </div>
        </>

    )
}