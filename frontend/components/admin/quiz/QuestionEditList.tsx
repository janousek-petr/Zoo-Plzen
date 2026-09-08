'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuiz, getQuestions, deleteQuestion, CATEGORY_LABEL } from '@/lib/api/quizzes'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCheckLine } from 'react-icons/ri'
import type { Quiz, Question } from '@/lib/types'
import { MenuCard, MenuCardProps } from '@/components/admin/MenuCard'
import MediaPreview from '@/components/admin/media/MediaPreview'
import Pagination from '@/components/admin/Pagination'

const ITEMS_PER_PAGE = 5;

export default function QuestionEditList({ quizId }: { quizId: number }) {
    const router = useRouter()
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        Promise.all([getQuiz(quizId), getQuestions(quizId)])
            .then(([quizData, questionsData]) => {
                setQuiz(quizData)
                setQuestions(questionsData)
                setLoading(false)
            })
            .catch(() => setLoading(false))
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

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedQuestions = questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
    const totalQuestions = questions.length;

    // Spočítá počet otázek pro každý klíč kategorie
    const categoryCounts = questions.reduce<Record<string, number>>((acc, q) => {
        const catName = q.category?.name;
        if (catName) {
            acc[catName] = (acc[catName] || 0) + 1;
        }
        return acc;
    }, {});

    const menuItems: MenuCardProps[] = [
        { label: "Vytvořit otázku", icon: RiAddLine, href: `/admin/quizzes/${quizId}/questions/add-question` }
    ];

    return (
        <>
            {/* Horní sekce s tlačítkem a statistikami */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                {/* Tlačítko Vytvořit otázku */}
                {menuItems.map((item) => (
                    <MenuCard key={item.href} {...item} />
                ))}

                {/* Karta se statistikami */}
                <div className="bg-gray-200/80 rounded-2xl p-5 flex flex-col justify-center gap-1.5 text-sm text-gray-800 border border-gray-300/50">
                    <p className="font-medium">
                        Otázek celkem: <span className="font-semibold">{totalQuestions}</span>
                    </p>

                    {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                        <p key={key} className="font-medium">
                            Počet otázek {label.toLowerCase()}: <span className="font-semibold">{categoryCounts[key] ?? 0}</span>
                        </p>
                    ))}
                </div>
            </div>

            <div className="p-6 flex flex-col gap-3">
                {questions.length === 0 && (
                    <p className="text-sm text-gray-400">Žádné otázky.</p>
                )}
                {paginatedQuestions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-start gap-3">
                                <span className="text-sm font-medium text-gray-400 mt-0.5">{startIndex + index + 1}.</span>
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

                        <MediaPreview
                            path={question.image}
                            alt="Otázka"
                            className="h-24 mb-3"
                        />
                        <MediaPreview
                            path={question.audio}
                        />

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

                                    {answer.audio && (
                                        <MediaPreview
                                            path={answer.audio}
                                        />
                                    )}
                                    {answer.image && (
                                        <MediaPreview
                                            path={answer.image}
                                            alt="Odpověď"
                                            className="h-10 max-w-45"
                                        />
                                    )}
                                    {answer.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ovládací lišta stránkování */}
            <div className="px-6 pb-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={questions.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </>
    )
}