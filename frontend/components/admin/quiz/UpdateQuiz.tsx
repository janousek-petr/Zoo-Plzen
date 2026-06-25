'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuiz, updateQuiz, getRegions } from '@/lib/api/quizzes'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import type { Region } from '@/lib/types'

export default function UpdateQuiz({ id }: { id: number }) {
  const router = useRouter()
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const [form, setForm] = useState({
    name: '',
    description: '',
    region_id: '',
    level: 1,
    is_published: false,
  })

  useEffect(() => {
    Promise.all([getQuiz(id), getRegions()]).then(([quiz, regions]) => {
      setForm({
        name: quiz.name ?? '',
        description: quiz.description ?? '',
        region_id: quiz.region ? String(quiz.region.id) : '',
        level: quiz.level ?? 1,
        is_published: quiz.is_published ?? false,
      })
      setTotalQuestions(quiz.total_questions)
      setRegions(regions)
      setFetching(false)
    })
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await updateQuiz(id, {
        name: form.name,
        description: form.description,
        region_id: form.region_id ? Number(form.region_id) : null,
        level: Number(form.level),
        is_published: form.is_published,
      })
      router.push(`/admin/quizzes/${id}`)
    } catch {
      setError('Nepodařilo se uložit kvíz.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className="text-lg text-gray-400 p-6 cus-font-impacted uppercase">Načítám...</p>

  return (
    <div className="max-w-xl ml-5">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Název</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Název kvízu"
            className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Popis</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Popis kvízu"
            className="text-lg text-gray-900 outline-none placeholder:text-gray-300 resize-none"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Oblast</label>
          <select
            name="region_id"
            value={form.region_id}
            onChange={handleChange}
            required
            className="text-lg text-gray-900 outline-none bg-transparent"
          >
            <option value="">-- Vyberte oblast --</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
          <label className="text-sm text-gray-400">Náročnost</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, level: lvl }))}
                className={`flex-1 py-2 rounded-lg text-lg uppercase font-medium transition-colors border-2 ${
                  Number(form.level) === lvl
                    ? lvl === 1 ? 'bg-green-100 text-green-800'
                    : lvl === 2 ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
          <label className="text-sm text-gray-400">Stav kvízu</label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={totalQuestions === 0}
              title={totalQuestions === 0 ? 'Nejprve přidej otázky' : ''}
              onClick={() => setForm(prev => ({ ...prev, is_published: true }))}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-lg font-medium border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                form.is_published
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <RiEyeLine /> Publikován
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, is_published: false }))}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-lg font-medium border-2 transition-colors ${
                !form.is_published
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <RiEyeOffLine /> Nepublikován
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-800 text-white font-semibold py-4 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Ukládám...' : 'Uložit změny'}
        </button>
      </form>
    </div>
  )
}