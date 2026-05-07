'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createQuiz } from '@/lib/api/quizzes'
import { getRegions } from '@/lib/api/quizzes'
import type { Region } from '@/lib/types'

export default function CreateQuizPage() {
  const router = useRouter()
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    region_id: '',
    level: 1,
  })

  useEffect(() => {
    getRegions().then(setRegions)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createQuiz({
        name: form.name,
        description: form.description,
        region_id: form.region_id ? Number(form.region_id) : undefined,
        level: Number(form.level),
      })
      router.push('/admin/quizzes')
    } catch {
      setError('Nepodařilo se vytvořit kvíz.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl ml-5">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Název</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Název kvízu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Popis</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 min-h-10"
            rows={3}
            placeholder="Popis kvízu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Oblast</label>
          <select
            name="region_id"
            value={form.region_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Vyberte oblast --</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Náročnost (1–3)</label>
          <input
            name="level"
            type="number"
            min={1}
            max={3}
            value={form.level}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Ukládám...' : 'Vytvořit kvíz'}
        </button>
      </form>
    </div>
  )
}