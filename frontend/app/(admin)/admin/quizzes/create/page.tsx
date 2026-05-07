import AddQuiz from "@/components/admin/AddQuiz";

export default function AdminQuizzes(){
    return(
        <>
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-8">
                <h1 className="text-4xl cus-font-impacted uppercase">Vytvořit kvíz</h1>
            </header>
            <div className="p-6">
                <AddQuiz/>
            </div>
        </>
    )
}