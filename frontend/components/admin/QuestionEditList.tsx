'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuiz, getQuestions, deleteQuestion } from '@/lib/api/quizzes'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCheckLine } from 'react-icons/ri'
import type { Quiz, Question } from '@/lib/types'
import { MenuCard, MenuCardProps} from '@/components/admin/MenuCard'

const CATEGORY_LABEL: Record<string, string> = {
    select: 'Výběr',
    true_false: 'Ano / Ne',
    image_select: 'Výběr obrázku',
}


export default function QuestionEditList({ quizId }: { quizId: number }) {
    const router = useRouter()
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

    const imgUrl = (path: string | null | undefined) =>
        path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null

    useEffect(() => {
        Promise.all([getQuiz(quizId), getQuestions(quizId)]).then(([quizData, questionsData]) => {
            setQuiz(quizData)
            setQuestions(questionsData)
            setLoading(false)
        })
    }, [quizId])

    const handleDeleteQuestion = async (question: Question) => {
        if (!confirm(`Opravdu chceš smazat otázku "${question.text}"? Smažou se i všechny odpovědi.`)) return
        try {
            await deleteQuestion(quizId, question.id!)
            setQuestions(prev => prev.filter(q => q.id !== question.id))
        } catch {
            alert('Nepodařilo se smazat otázku.')
        }
    }

    if (loading) return <p className="text-lg text-gray-400 p-6 cus-font-impacted uppercase">Načítám...</p>
    if (!quiz) return <p className="text-lg text-red-400 p-6">Kvíz nenalezen.</p>

    const menuItems: MenuCardProps[] = [
        {label: "Vytvořit otázku", icon: RiAddLine, href: `/admin/quizzes/${quizId}/questions/add-question`}
    ];

    return (
        <>  
            <div className="p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {menuItems.map((item) => (
                    <MenuCard key={item.href} {...item} />
                    ))}
                </div>
            </div>

            <div className="p-6 flex flex-col gap-3">
                {questions.length === 0 && (
                    <p className="text-sm text-gray-400">Žádné otázky.</p>
                )}
                {questions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-start gap-3">
                                <span className="text-sm font-medium text-gray-400 mt-0.5">{index + 1}.</span>
                                <p className="text-sm font-medium text-gray-900">{question.text}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {CATEGORY_LABEL[question.category?.name ?? ''] ?? question.category?.name ?? '—'}
                                </span>
                                <span className="text-xs text-gray-400">{question.points} b.</span>
                                <button
                                    onClick={() => router.push(`/admin/quizzes/${quizId}/questions/${question.id}/edit-question`)}
                                    className="flex items-center gap-1 text-sm text-white px-2 py-1 rounded bg-sky-600 hover:bg-sky-800 transition-colors"
                                >
                                    <RiEditLine /> Upravit
                                </button>
                                <button
                                    onClick={() => handleDeleteQuestion(question)}
                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-white px-2 py-1 rounded border border-transparent hover:bg-red-600 transition-colors"
                                >
                                    <RiDeleteBinLine />
                                </button>
                            </div>
                        </div>

                        {question.image && (
                            <img
                                src={imgUrl(question.image)!}
                                alt="Obrázek otázky"
                                className="h-24 object-contain mb-3"
                            />
                        )}

                        <div className="flex flex-col gap-1.5">
                            {question.answers.map(answer => (
                                <div
                                    key={answer.id}
                                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                                        answer.is_correct
                                            ? 'bg-green-50 text-green-800 border border-green-200'
                                            : 'bg-gray-50 text-gray-600 border border-gray-100'
                                    }`}
                                >
                                    {answer.is_correct ? (
                                        <RiCheckLine className="text-green-600 shrink-0" />
                                    ) : (
                                        <span className="w-4 shrink-0" />
                                    )}
                                    {answer.image && (
                                        <img src={imgUrl(answer.image)!} alt="Obrázek odpovědi" className="h-10 object-contain" />
                                    )}
                                    {answer.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}