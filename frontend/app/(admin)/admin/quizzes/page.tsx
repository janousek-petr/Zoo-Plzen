import QuizMenu from "@/components/admin/QuizMenu"
import Header from "@/components/admin/Header"

export default function AdminQuizzes(){
    return(
        <>
            <Header title="Správa kvízů" href="/admin"/>

            <div className="p-6">
                <QuizMenu/>
            </div>
        </>
    )
}