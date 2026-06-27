import Header from '@/components/admin/Header'
import AddQuestion from "@/components/admin/quiz/AddQuestion"

export default async function AddQuestionPage({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params

    return(
        <>
            <Header title='Vytvořit otázku' href={`/admin/quizzes/${id}/questions`}/>

            <div className="p-6">
                <AddQuestion quizId={Number(id)} />
            </div>
        </>

    )
}