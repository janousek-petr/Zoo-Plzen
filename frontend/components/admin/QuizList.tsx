'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuizzes } from '@/lib/api/quizzes'
import { RiAddFill, RiEditLine, RiListCheck, RiDeleteBinLine, RiMapPinLine } from 'react-icons/ri'
import type { Quiz } from '@/lib/types'

const LEVEL_BADGE: Record<number, string> = {
  1: 'bg-green-50 text-green-800',
  2: 'bg-amber-50 text-amber-800',
  3: 'bg-red-50 text-red-800',
}

function groupByRegion(quizzes: Quiz[]) {
  return quizzes.reduce<Record<string, Quiz[]>>((acc, quiz) => {
    const region = quiz.region?.name ?? 'Bez oblasti'
    if (!acc[region]) acc[region] = []
    acc[region].push(quiz)
    return acc
  }, {})
}

export default function QuizList() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuizzes().then(data => {
      setQuizzes(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="text-lg text-gray-400 p-6 cus-font-impacted">Načítám...</p>

  const grouped = groupByRegion(quizzes)

  return (
    <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([region, items]) => (
            <div key={region}>

                <div className="flex items-center gap-3 mb-3">
                    <RiMapPinLine className="text-gray-600 text-lg" />
                    <h2 className="text-xl text-gray-600 uppercase cus-font-impacted">{region}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {items.map(quiz => (

                    <div key={quiz.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                        <div>
                            <p className="text-lg font-medium text-gray-900 mb-0.5 border-b py-2 border-gray-200">{quiz.name}</p>
                            {quiz.description && (
                                <p className="text-md text-gray-400 truncate">{quiz.description}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-md font-medium px-2 py-0.5 rounded-full ${LEVEL_BADGE[quiz.level] ?? 'bg-gray-100 text-gray-600'}`}>
                            Level {quiz.level}
                        </span>
                        <span className="text-md text-gray-400">{quiz.total_questions} otázek</span>
                        <span className="text-md text-gray-400">{quiz.total_points} bodů</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => router.push(`/admin/quizzes/${quiz.id}/edit`)}
                            className="flex items-center gap-1 text-md text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                        >
                            <RiEditLine /> Upravit
                        </button>
                        <button
                            onClick={() => router.push(`/admin/quizzes/${quiz.id}/questions`)}
                            className="flex items-center gap-1 text-md text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                        >
                            <RiListCheck /> Otázky
                        </button>
                        <button
                            onClick={() => console.log('smazat', quiz.id)}
                            className="flex items-center gap-1 text-md text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors ml-auto"
                        >
                            <RiDeleteBinLine />
                        </button>
                        </div>
                    </div>

                    ))}
                </div>

            </div>
        ))}
    </div>
  )
}