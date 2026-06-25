'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import userService from '@/lib/api/users'
import type { User } from '@/lib/types'

export default function UpdateUser({ id }: { id: number }) {
  const router = useRouter()
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })

  useEffect(() => {
    userService.getOne(id).then(res => {
      const user: User = res.data
      setForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
      })
      setFetching(false)
    })
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await userService.update(id, form)
      router.push(`/admin/users/${id}`)
    } catch {
      setError('Nepodařilo se uložit změny.')
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
          <label className="text-sm text-gray-400">Jméno</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            placeholder="Jméno"
            className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Příjmení</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            placeholder="Příjmení"
            className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">E-mail</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="E-mail"
            className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
          />
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