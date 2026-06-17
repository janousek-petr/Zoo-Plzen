'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  RiEditLine,
  RiDeleteBinLine,
  RiMailLine,
  RiShieldUserLine,
  RiCalendarLine,
  RiUserLine,
} from 'react-icons/ri'
import { MenuCard, MenuCardProps } from '@/components/admin/MenuCard'
import Header from '@/components/admin/Header'
import userService from '@/lib/api/users'
import type { User, Profile } from '@/lib/types'

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

const resolveUrl = (path: string | null | undefined) =>
  path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null

export default function UserDetail({ id }: { id: number }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getOne(id)
      .then(res => setUser(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!user) return
    if (!confirm(`Opravdu chceš smazat uživatele „${user.email}"? Smažou se i všechny jeho profily.`)) return
    try {
      await userService.destroy(user.id)
      router.push('/admin/users')
    } catch {
      alert('Nepodařilo se smazat uživatele.')
    }
  }

  if (loading) return <p className="text-lg text-gray-400 p-6 cus-font-impacted uppercase">Načítám...</p>
  if (!user) return <p className="text-lg text-red-400 p-6">Uživatel nenalezen.</p>

  const menuItems: MenuCardProps[] = [
    { label: 'Upravit uživatele', icon: RiEditLine, href: `/admin/users/${id}/edit` },
  ]

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return (
    <>
      <Header title={fullName || user.email} href="/admin/users" />

      <div className="flex flex-col">

        {/* Menu karty */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {menuItems.map(item => (
              <MenuCard key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-6">

          {/* Smazat */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-lg text-white px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition-colors cursor-pointer"
            >
              <RiDeleteBinLine /> Smazat uživatele
            </button>
          </div>

          {/* Info karty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">E-mail</p>
              <div className="flex items-center gap-1.5">
                <RiMailLine className="text-gray-500" />
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Role</p>
              <div className="flex items-center gap-1.5">
                <RiShieldUserLine className="text-gray-500" />
                {user.role === 'admin' ? (
                  <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Správce
                  </span>
                ) : (
                  <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    Uživatel
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Registrován</p>
              <div className="flex items-center gap-1.5">
                <RiCalendarLine className="text-gray-500" />
                <p className="text-sm font-medium text-gray-800">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Profily */}
          <div>
            <h2 className="text-xl text-gray-600 uppercase cus-font-impacted mb-3">Profily</h2>

            {!user.profiles || user.profiles.length === 0 ? (
              <p className="text-sm text-gray-400">Žádné profily.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {user.profiles.map((profile: Profile) => {
                  const avatar = resolveUrl(profile.avatar_url)
                  const profileName = profile.nickname
                    ?? ([profile.first_name, profile.last_name].filter(Boolean).join(' ') || '—')

                  return (
                    <Link
                      key={profile.id}
                      href={`/admin/users/${id}/profiles/${profile.id}`}
                      className="group bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors duration-100"
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={profileName}
                          className="w-16 h-16 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <RiUserLine className="text-2xl text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-800 text-center leading-tight group-hover:text-sky-600 transition-colors">
                        {profileName}
                      </p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}