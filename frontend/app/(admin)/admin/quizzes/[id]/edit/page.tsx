import UpdateQuiz from "@/components/admin/quiz/UpdateQuiz"
import Header from "@/components/admin/Header"

export default async function UpdateQuizPage({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params

    return(
        <>
            <Header title="Úprava kvízu" href={`/admin/quizzes/${id}`}/>

            <div className="p-6">
                <UpdateQuiz id={Number(id)}/>
            </div>
        </>
    )
}