'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri'
import userService from '@/lib/api/users'

export default function AddUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })

  // Po vytvoření zobrazíme vygenerované heslo
  const [createdUser, setCreatedUser] = useState<{
    id: number
    email: string
    password: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await userService.create(form)
      // Backend (UserController::store) vrací: { user: {...}, generated_password: "..." }
      setCreatedUser({
        id: res.data.user.id,
        email: res.data.user.email,
        password: res.data.generated_password,
      })
    } catch {
      setError('Nepodařilo se vytvořit uživatele. Zkontroluj, zda e-mail už není použitý.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!createdUser) return
    navigator.clipboard.writeText(createdUser.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Po úspěšném vytvoření zobrazíme heslo místo formuláře
  if (createdUser) {
    return (
      <div className="max-w-xl ml-5">
        <div className="bg-white border border-green-200 rounded-xl p-6 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Uživatel vytvořen</p>
            <p className="text-lg font-medium text-gray-900">{createdUser.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Vygenerované heslo</p>
            <p className="text-xs text-amber-600 mb-2">
              Ulož si ho nebo zkopíruj — po opuštění této stránky ho už nezobrazíme.
            </p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <code className="flex-1 text-lg font-mono text-gray-900">{createdUser.password}</code>
              <button
                onClick={handleCopy}
                type="button"
                className="flex items-center gap-1 text-sm text-white px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-800 transition-colors cursor-pointer"
              >
                {copied ? <><RiCheckLine /> Zkopírováno</> : <><RiFileCopyLine /> Zkopírovat</>}
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push(`/admin/users/${createdUser.id}`)}
            className="bg-sky-600 hover:bg-sky-800 text-white font-semibold py-4 px-4 rounded mt-2"
          >
            Přejít na detail uživatele
          </button>
        </div>
      </div>
    )
  }

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
          {loading ? 'Vytvářím...' : 'Vytvořit uživatele'}
        </button>

      </form>
    </div>
  )
}