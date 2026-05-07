import QuizMenu from "@/components/admin/QuizMenu";

export default function AdminQuizzes(){
    return(
        <>
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-8">
                <h1 className="text-4xl cus-font-impacted uppercase">Správa kvízů</h1>
            </header>
            <div className="p-6">
                <QuizMenu/>
            </div>
        </>
    )
}