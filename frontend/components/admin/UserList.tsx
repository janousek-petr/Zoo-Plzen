'use client'

import { useEffect, useState } from 'react'
import { UserTab } from './UserTab'
import userService from '@/lib/api/users'
import type { User } from '@/lib/types'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getAll()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-400 p-3">Načítám...</p>
  if (!users.length) return <p className="text-gray-400 p-3">Žádní uživatelé.</p>

  return (
    <div className="flex flex-col gap-2">
      {users.map(user => (
        <UserTab
          key={user.id}
          email={user.email}
          profiles={user.profiles_count ?? 0}
        />
      ))}
    </div>
  )
}