'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiDeleteBinLine,
  RiUserLine,
  RiPencilLine,
} from 'react-icons/ri'
import Header from '@/components/admin/Header'
import profileService from '@/lib/api/profiles'
import { getItems } from '@/lib/api/items'
import AssetPickerButton from '@/components/admin/item/AssetPickerButton'
import type { Profile, Item } from '@/lib/types'

// stejná ID kategorií jako v BackpackTab
const CATEGORY_AVATAR = 1
const CATEGORY_ACCESSORY = 2
const CATEGORY_WALLPAPER = 3

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

const resolveUrl = (path: string | null | undefined) =>
  path ? (path.startsWith('http') ? path : `${apiBase}${path}`) : null

type FormState = {
  first_name: string
  last_name: string
  nickname: string
  avatar_item_id: number | null
  accessory_item_id: number | null
  wallpaper_item_id: number | null
  level: string
  xp: string
  points: string
}

// Textové pole se štítkem, tužkou a jasným "editable" vzhledem (border + focus ring)
function EditableField({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  name: 'first_name' | 'last_name' | 'nickname'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="group bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-1.5 focus-within:border-gray-500/20 focus-within:ring-2 focus-within:ring-gray-500 hover:border-gray-400 transition-colors">
      <label htmlFor={name} className="flex items-center gap-1.5 text-sm text-gray-400">
        {label}
        <RiPencilLine className="text-gray-300 group-focus-within:text-gray-500 transition-colors" size={13} />
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="text-lg text-gray-900 outline-none placeholder:text-gray-300 bg-transparent"
      />
    </div>
  )
}

// Číselné pole se štítkem a stejným "editable" vzhledem jako EditableField
// Hodnota se drží jako string, ať mazání pole nezůstává na "0" a nevznikají věci jako "0500"
function EditableNumberField({
  label,
  name,
  value,
  onChange,
  min = 0,
}: {
  label: string
  name: 'level' | 'xp' | 'points'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
}) {
  return (
    <div className="group bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-1.5 focus-within:border-gray-500/20 focus-within:ring-2 focus-within:ring-gray-500 hover:border-gray-400 transition-colors">
      <label htmlFor={name} className="flex items-center gap-1.5 text-sm text-gray-400">
        {label}
        <RiPencilLine className="text-gray-300 group-focus-within:text-gray-500 transition-colors" size={13} />
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min={min}
        value={value}
        onChange={onChange}
        onBlur={() => {
          if (value === '') onChange({ target: { name, value: String(min) } } as React.ChangeEvent<HTMLInputElement>)
        }}
        className="text-lg text-gray-900 outline-none placeholder:text-gray-300 bg-transparent"
      />
    </div>
  )
}

export default function ProfileDetail({ userId, profileId }: { userId: number; profileId: number }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [allItems, setAllItems] = useState<Item[]>([])

  const [form, setForm] = useState<FormState>({
    first_name: '',
    last_name: '',
    nickname: '',
    avatar_item_id: null,
    accessory_item_id: null,
    wallpaper_item_id: null,
    level: '1',
    xp: '0',
    points: '0',
  })

  useEffect(() => {
    Promise.all([profileService.getOne(profileId), getItems()]).then(([res, items]) => {
      const p = res.data
      setProfile(p)
      setAllItems(items)
      setForm({
        first_name: p.first_name ?? '',
        last_name: p.last_name ?? '',
        nickname: p.nickname ?? '',
        avatar_item_id: p.avatar_item_id ?? null,
        accessory_item_id: p.accessory_item_id ?? null,
        wallpaper_item_id: p.wallpaper_item_id ?? null,
        level: String(p.level ?? 1),
        xp: String(p.xp ?? 0),
        points: String(p.points ?? 0),
      })
      setFetching(false)
    })
  }, [profileId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // odstraní nečíselné znaky a případné nechtěné vedoucí nuly (např. "0500" -> "500")
    let val = e.target.value.replace(/[^\d]/g, '')
    if (val.length > 1) val = val.replace(/^0+/, '') || '0'
    setForm(prev => ({ ...prev, [e.target.name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        level: form.level === '' ? 1 : Number(form.level),
        xp: form.xp === '' ? 0 : Number(form.xp),
        points: form.points === '' ? 0 : Number(form.points),
      }
      const res = await profileService.update(profileId, payload)
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

  const avatarItem = allItems.find(i => i.id === form.avatar_item_id) ?? null
  const accessoryItem = allItems.find(i => i.id === form.accessory_item_id) ?? null
  const wallpaperItem = allItems.find(i => i.id === form.wallpaper_item_id) ?? null

  const avatarPreview = resolveUrl(avatarItem?.image)

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
              {avatarPreview ? (
                <img src={avatarPreview} alt={displayName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
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

            <EditableNumberField label="Level" name="level" value={form.level} onChange={handleNumberChange} min={1} />
            <EditableNumberField label="XP" name="xp" value={form.xp} onChange={handleNumberChange} />
            <EditableNumberField label="Body" name="points" value={form.points} onChange={handleNumberChange} />
          </div>

          {/* Editace */}
          <div>
            <h2 className="text-xl text-gray-600 uppercase cus-font-impacted mb-3">Upravit profil</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-4">

              <EditableField label="Jméno" name="first_name" value={form.first_name} onChange={handleChange} required placeholder="Jméno" />
              <EditableField label="Příjmení" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Příjmení" />
              <EditableField label="Přezdívka" name="nickname" value={form.nickname} onChange={handleChange} placeholder="Přezdívka" />

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                <label className="text-sm text-gray-400">Avatar</label>
                <AssetPickerButton
                  value={avatarItem}
                  onChange={item => setForm(prev => ({ ...prev, avatar_item_id: item.id }))}
                  itemCategoryId={CATEGORY_AVATAR}
                  label="Vybrat avatara"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                <label className="text-sm text-gray-400">Doplněk (accessory)</label>
                <AssetPickerButton
                  value={accessoryItem}
                  onChange={item => setForm(prev => ({ ...prev, accessory_item_id: item.id }))}
                  onClear={() => setForm(prev => ({ ...prev, accessory_item_id: null }))}
                  itemCategoryId={CATEGORY_ACCESSORY}
                  label="Vybrat doplněk"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                <label className="text-sm text-gray-400">Tapeta (wallpaper)</label>
                <AssetPickerButton
                  value={wallpaperItem}
                  onChange={item => setForm(prev => ({ ...prev, wallpaper_item_id: item.id }))}
                  itemCategoryId={CATEGORY_WALLPAPER}
                  label="Vybrat tapetu"
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