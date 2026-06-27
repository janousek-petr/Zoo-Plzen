'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createText } from '@/lib/api/texts'
import { getRegions } from '@/lib/api/quizzes'
import type { Region } from '@/lib/types'

const LEVEL_LABEL: Record<number, string> = {
  1: 'Základní info',
  2: 'Další info',
  3: 'Fun fact',
}

export default function RegionInfoCreate() {
  const router = useRouter()
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    region_id: '',
    level: 1,
    text: '',
  })

  useEffect(() => {
    getRegions().then(setRegions)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createText({
        region_id: Number(form.region_id),
        level: Number(form.level),
        text: form.text,
      })
      router.push('/admin/texts/region-infos')
    } catch {
      setError('Nepodařilo se vytvořit text.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl ml-5">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <label className="text-sm text-gray-400">Úroveň</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, level: lvl }))}
                className={`flex-1 py-2 rounded-lg text-md font-medium transition-colors ${
                  Number(form.level) === lvl
                    ? lvl === 1 ? 'bg-green-100 text-green-800'
                    : lvl === 2 ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {LEVEL_LABEL[lvl]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Text</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Text informace..."
            className="text-lg text-gray-900 outline-none placeholder:text-gray-300 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Ukládám...' : 'Vytvořit text'}
        </button>
      </form>
    </div>
  )
}