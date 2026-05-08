"use client"

import AddQuiz from "@/components/admin/AddQuiz"
import Header from "@/components/admin/Header"

export default function AdminQuizzes(){
    return(
        <>
            <Header title="Vytvořit kvíz" href="/admin/quizzes"/>

            <div className="p-6">
                <AddQuiz />
            </div>
        </>
    )
}