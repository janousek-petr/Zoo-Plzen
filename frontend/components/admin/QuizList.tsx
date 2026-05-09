'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuizzes, togglePublishQuiz, deleteQuiz } from '@/lib/api/quizzes'
import { RiEditLine, RiListCheck, RiDeleteBinLine, RiMapPinLine, RiArrowDownSLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import type { Quiz } from '@/lib/types'

const LEVEL_BADGE: Record<number, string> = {
  1: 'bg-green-50 text-green-800',
  2: 'bg-amber-50 text-amber-800',
  3: 'bg-red-50 text-red-800',
}

function groupByRegion(quizzes: Quiz[]) {
  return quizzes.reduce<Record<string, Quiz[]>>((acc, quiz) => {
    const region = quiz.region?.name ?? 'Žádná oblast'
    if (!acc[region]) acc[region] = []
    acc[region].push(quiz)
    return acc
  }, {})
}

function sortedRegionEntries(grouped: Record<string, Quiz[]>) {
  return Object.entries(grouped).sort(([a], [b]) => {
    if (a === 'Žádná oblast') return 1
    if (b === 'Žádná oblast') return -1
    return a.localeCompare(b, 'cs')
  })
}

export default function QuizList() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    getQuizzes().then(data => {
      setQuizzes(data)
      const grouped = groupByRegion(data)
      setOpenRegions(Object.fromEntries(Object.keys(grouped).map(r => [r, true])))
      setLoading(false)
    })
  }, [])

  const toggleRegion = (region: string) => {
    setOpenRegions(prev => ({ ...prev, [region]: !prev[region] }))
  }

  const handleTogglePublish = async (e: React.MouseEvent, quiz: Quiz) => {
    e.stopPropagation()
    try {
      const res = await togglePublishQuiz(quiz.id)
      setQuizzes(prev =>
        prev.map(q => q.id === quiz.id ? { ...q, is_published: res.is_published } : q)
      )
    } catch {
      alert('Nepodařilo se změnit stav kvízu.')
    }
  }

  const handleDelete = async (e: React.MouseEvent, quiz: Quiz) => {
        e.stopPropagation()
        if (!confirm(`Opravdu chceš smazat kvíz "${quiz.name}"? Smažou se i všechny otázky a odpovědi.`)) return
        try {
            await deleteQuiz(quiz.id)
            setQuizzes(prev => prev.filter(q => q.id !== quiz.id))
        } catch {
            alert('Nepodařilo se smazat kvíz.')
        }
    }

  if (loading) return <p className="text-lg text-gray-400 p-6 cus-font-impacted">Načítám...</p>

  const grouped = groupByRegion(quizzes)

  return (
    <div className="flex flex-col gap-4">
      {sortedRegionEntries(grouped).map(([region, items]) => {
        const isOpen = openRegions[region] ?? true
        return (
          <div key={region} className="border border-gray-200 rounded-xl overflow-hidden">

            <button
              onClick={() => toggleRegion(region)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <RiMapPinLine className="text-gray-600 text-lg" />
              <h2 className="text-xl text-gray-600 uppercase cus-font-impacted flex-1 text-left">{region}</h2>
              <RiArrowDownSLine className={`text-gray-400 text-3xl transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>

            {isOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                {items.map(quiz => (
                  <div
                    key={quiz.id}
                    onClick={() => router.push(`/admin/quizzes/${quiz.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:bg-gray-50 hover:border-gray-400 duration-100 cursor-pointer"
                  >
                    <div className="border-b py-2 border-gray-200">
                      <p className="text-lg font-medium text-gray-900 mb-0.5">{quiz.name}</p>
                      {quiz.description && (
                        <p className="text-md text-gray-400 truncate">{quiz.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-col">
                      <div className="flex items-center gap-2">
                      </div>
                      <p className="text-md text-gray-600">{region}</p>
                      <div className="flex flex-row gap-4 items-center">
                        <p className={`text-md font-medium px-2 py-0.5 rounded-full ${LEVEL_BADGE[quiz.level] ?? 'bg-gray-100 text-gray-600'}`}>
                          Level {quiz.level}
                        </p>
                        <p className="text-md text-gray-400">{quiz.total_questions} otázek</p>
                        <p className="text-md text-gray-400">{quiz.total_points} bodů</p>
                           {quiz.is_published ? (
                          <span className="text-md font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
                            Publikován
                          </span>
                        ) : (
                          <span className="text-md font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            Nepublikován
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={e => { e.stopPropagation(); router.push(`/admin/quizzes/${quiz.id}/edit`) }}
                        className="flex items-center gap-1 text-lg text-white border-2 border-transparent px-2 py-1 rounded bg-sky-600 hover:bg-sky-800 hover:border-sky-800 transition-colors cursor-pointer"
                      >
                        <RiEditLine /> Upravit
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); router.push(`/admin/quizzes/${quiz.id}/questions`) }}
                        className="flex items-center gap-1 text-lg text-white border-2 border-transparent px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 hover:border-yellow-700 transition-colors cursor-pointer"
                      >
                        <RiListCheck /> Otázky
                      </button>
                      <button
                        onClick={e => handleTogglePublish(e, quiz)}
                        disabled={!quiz.is_published && quiz.total_questions === 0}
                        title={quiz.is_published ? 'Skrýt kvíz' : (quiz.total_questions > 0 ? 'Publikovat' : 'Nejprve přidej otázky')}
                        className={`flex items-center gap-1 text-lg text-white border-2 border-transparent px-2 py-1 rounded transition-colors cursor-pointer h-full
                          ${quiz.is_published
                            ? 'bg-green-600 hover:bg-green-800'
                            : 'bg-gray-400 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                      >
                        {quiz.is_published ? <RiEyeLine /> : <RiEyeOffLine />}
                      </button>
                      <button
                        onClick={e => handleDelete(e, quiz)}
                        className="flex items-center h-full gap-1 text-xl text-red-600 hover:text-white border-2 border-transparent px-2 py-1 rounded hover:bg-red-600 transition-colors ml-auto cursor-pointer"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )
      })}
    </div>
  )
}