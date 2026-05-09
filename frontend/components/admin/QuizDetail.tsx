'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuiz, getQuestions, togglePublishQuiz, deleteQuiz } from '@/lib/api/quizzes'
import { RiAddFill, RiMapPinLine, RiEditLine, RiArrowLeftLine, RiStarLine, RiQuestionLine, RiCheckLine, RiEyeLine, RiEyeOffLine, RiDeleteBinLine } from 'react-icons/ri'
import type { Quiz, Question } from '@/lib/types'
import { MenuCard, MenuCardProps } from "./MenuCard";
import Header from '@/components/admin/Header'

const LEVEL_BADGE: Record<number, string> = {
    1: 'bg-green-50 text-green-800',
    2: 'bg-amber-50 text-amber-800',
    3: 'bg-red-50 text-red-800',
}

const CATEGORY_LABEL: Record<string, string> = {
    select: 'Výběr',
    true_false: 'Ano / Ne',
    image_select: 'Výběr obrázku',
}

export default function QuizDetail({ id }: { id: number }) {
    const router = useRouter()
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

    const imgUrl = (path: string | null | undefined) =>
        path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null

    useEffect(() => {
        Promise.all([getQuiz(id), getQuestions(id)]).then(([quizData, questionsData]) => {
            setQuiz(quizData)
            setQuestions(questionsData)
            setLoading(false)
        })
    }, [id])

    const handleTogglePublish = async () => {
        if (!quiz) return
        try {
            const res = await togglePublishQuiz(quiz.id)
            setQuiz(prev => prev ? { ...prev, is_published: res.is_published } : prev)
        } catch {
            alert('Nepodařilo se změnit stav kvízu.')
        }
    }

    const handleDelete = async () => {
        if (!quiz) return
        if (!confirm(`Opravdu chceš smazat kvíz "${quiz.name}"? Smažou se i všechny otázky a odpovědi.`)) return
        try {
            await deleteQuiz(quiz.id)
            router.push('/admin/quizzes')
        } catch {
            alert('Nepodařilo se smazat kvíz.')
        }
    }

    if (loading) return <p className="text-lg text-gray-400 p-6 cus-font-impacted uppercase">Načítám...</p>
    if (!quiz) return <p className="text-lg text-red-400 p-6">Kvíz nenalezen.</p>

    const menuItems: MenuCardProps[] = [
        { label: "Upravit kvíz", icon: RiEditLine, href: `/admin/quizzes/${id}/edit`},
        { label: "Správa otázek", icon: RiQuestionLine, href: `/admin/quizzes/${id}/questions`}
    ];

    return (
        <>
        <Header title={quiz.name} href="/admin/quizzes"/>

        <div className="flex flex-col">
        
            <div className="p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {menuItems.map((item) => (
                    <MenuCard key={item.href} {...item} />
                    ))}
                </div>
            </div>

            <div className="p-6 flex flex-col gap-6">

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleTogglePublish}
                        disabled={!quiz.is_published && quiz.total_questions === 0}
                        title={quiz.is_published ? 'Skrýt kvíz' : (quiz.total_questions > 0 ? 'Publikovat' : 'Nejprve přidej otázky')}
                        className={`flex items-center gap-2 text-lg text-white px-3 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                            ${quiz.is_published
                                ? 'bg-green-600 hover:bg-green-800'
                                : 'bg-gray-400 hover:bg-gray-600'
                            }`}
                    >
                        {quiz.is_published ? <><RiEyeLine/>Publikován</> : <><RiEyeOffLine/>Nepublikován</>}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-lg text-white px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition-colors cursor-pointer"
                    >
                        <RiDeleteBinLine /> Smazat kvíz
                    </button>
                </div>

                {/* Info karty */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">Region</p>
                        <div className="flex items-center gap-1.5">
                            <RiMapPinLine className="text-gray-500" />
                            <p className="text-sm font-medium text-gray-800">{quiz.region?.name ?? '—'}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Stav</p>
                            <div className="flex items-center gap-2">
                                {quiz.is_published ? (
                                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
                                        Publikován
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                        Nepublikován
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">Náročnost</p>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${LEVEL_BADGE[quiz.level]}`}>
                            Level {quiz.level}
                        </span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">Otázky</p>
                        <div className="flex items-center gap-1.5">
                            <RiQuestionLine className="text-gray-500" />
                            <p className="text-sm font-medium text-gray-800">{quiz.total_questions}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">Celkem bodů</p>
                        <div className="flex items-center gap-1.5">
                            <RiStarLine className="text-gray-500" />
                            <p className="text-sm font-medium text-gray-800">{quiz.total_points}</p>
                        </div>
                    </div>
                </div>

                {/* Popis */}
                {quiz.description && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">Popis</p>
                        <p className="text-sm text-gray-700">{quiz.description}</p>
                    </div>
                )}

                {/* Otázky */}
                <div>
                    <h2 className="text-xl text-gray-600 uppercase cus-font-impacted mb-3">Otázky</h2>
                    <div className="flex flex-col gap-3">
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
                                                <img
                                                    src={imgUrl(answer.image)!}
                                                    alt={answer.text}
                                                    className="h-10 object-contain"
                                                />
                                            )}
                                            {answer.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}