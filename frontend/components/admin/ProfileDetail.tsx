'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiDeleteBinLine,
  RiStarLine,
  RiTrophyLine,
  RiUserLine,
} from 'react-icons/ri'
import Header from '@/components/admin/Header'
import profileService from '@/lib/api/profiles'
import type { Profile } from '@/lib/types'

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

const resolveUrl = (path: string | null | undefined) =>
  path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null

export default function ProfileDetail({ userId, profileId }: { userId: number; profileId: number }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    avatar_url: '',
    accessory_url: '',
    wallpaper_url: '',
  })

  useEffect(() => {
    profileService.getOne(profileId).then(res => {
      const p = res.data
      setProfile(p)
      setForm({
        first_name: p.first_name ?? '',
        last_name: p.last_name ?? '',
        nickname: p.nickname ?? '',
        avatar_url: p.avatar_url ?? '',
        accessory_url: p.accessory_url ?? '',
        wallpaper_url: p.wallpaper_url ?? '',
      })
      setFetching(false)
    })
  }, [profileId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await profileService.update(profileId, form)
      setProfile(res.data)
    } catch {
      setError('Nepodařilo se uložit změny.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!profile) return
    const name = profile.nickname ?? profile.first_name
    if (!confirm(`Opravdu chceš smazat profil „${name}"?`)) return
    try {
      await profileService.destroy(profileId)
      router.push(`/admin/users/${userId}`)
    } catch {
      alert('Nepodařilo se smazat profil.')
    }
  }

  if (fetching) return <p className="text-lg text-gray-400 p-6 cus-font-impacted uppercase">Načítám...</p>
  if (!profile) return <p className="text-lg text-red-400 p-6">Profil nenalezen.</p>

  const displayName = profile.nickname ?? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
  const avatar = resolveUrl(form.avatar_url)

  return (
    <>
      <Header title={displayName || 'Profil'} href={`/admin/users/${userId}`} />

      <div className="flex flex-col">
        <div className="px-6 pt-6 flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-lg text-white px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition-colors cursor-pointer"
          >
            <RiDeleteBinLine /> Smazat profil
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* Avatar náhled + statistiky */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              {avatar ? (
                <img src={avatar} alt={displayName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <RiUserLine className="text-xl text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Profil</p>
                <p className="text-sm font-medium text-gray-800">{displayName || '—'}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Level</p>
              <div className="flex items-center gap-1.5">
                <RiTrophyLine className="text-gray-500" />
                <p className="text-sm font-medium text-gray-800">{profile.level}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">XP</p>
              <div className="flex items-center gap-1.5">
                <RiStarLine className="text-gray-500" />
                <p className="text-sm font-medium text-gray-800">{profile.xp}</p>
              </div>
            </div>
          </div>

          {/* Editace */}
          <div>
            <h2 className="text-xl text-gray-600 uppercase cus-font-impacted mb-3">Upravit profil</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-4">

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
                  placeholder="Příjmení"
                  className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                <label className="text-sm text-gray-400">Přezdívka</label>
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder="Přezdívka"
                  className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                <label className="text-sm text-gray-400">URL avatara</label>
                <input
                  name="avatar_url"
                  value={form.avatar_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                <label className="text-sm text-gray-400">URL doplňku (accessory)</label>
                <input
                  name="accessory_url"
                  value={form.accessory_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                <label className="text-sm text-gray-400">URL tapety (wallpaper)</label>
                <input
                  name="wallpaper_url"
                  value={form.wallpaper_url}
                  onChange={handleChange}
                  placeholder="https://..."
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

        </div>
      </div>
    </>
  )
}