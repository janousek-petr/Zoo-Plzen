import Link from "next/link"
import { RiEditLine } from 'react-icons/ri'

export interface UserTabProps {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  profiles: number
  created_at: string
}

export function UserTab({ id, first_name, last_name, email, profiles, created_at, role }: UserTabProps) {
  const formattedDate = new Date(created_at).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })

  const formattedProfiles = profiles === 1
    ? '1 profil'
    : profiles >= 2 && profiles <= 4
    ? `${profiles} profily`
    : `${profiles} profilů`

  return (
    <div className="flex flex-row items-center gap-4 p-4 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-400 duration-100 rounded-xl shadow-sm cursor-default">
      <div className="flex-1 min-w-0">
        <p className="text-lg text-gray-900">{email}</p>
      </div>

      {role === 'admin' && (
        <span className="uppercase bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-bold shrink-0">Správce</span>
      )}
      <span className="text-black/50 shrink-0">{formattedProfiles}</span>
      <span className="text-black/50 shrink-0">{formattedDate}</span>

      <Link
        href={`/admin/users/${id}`}
        className="flex items-center gap-1 text-lg text-white border-2 border-transparent px-2 py-1 rounded bg-sky-600 hover:bg-sky-800 hover:border-sky-800 transition-colors cursor-pointer"
      >
        <RiEditLine /> Upravit
      </Link>
    </div>
  )
}