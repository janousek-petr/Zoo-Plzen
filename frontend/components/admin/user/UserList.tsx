'use client'

import { useEffect, useState } from 'react'
import { UserTab } from './UserTab'
import userService from '@/lib/api/users'
import type { User } from '@/lib/types'
import { RiSearchLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'

const ITEMS_PER_PAGE = 10

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    userService.getAll()
        .then(res => setUsers(res.data))
        .finally(() => setLoading(false))
  }, [])

  // Při změně vyhledávání vrátíme uživatele na 1. stránku
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Filtrování podle dotazu
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.toLowerCase()
    const email = (user.email ?? '').toLowerCase()

    return fullName.includes(query) || email.includes(query)
  })

  // Výpočet stránkování
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) return <p className="text-gray-400 p-3">Načítám...</p>
  if (!users.length) return <p className="text-gray-400 p-3">Žádní uživatelé.</p>

  return (
      <div className="flex flex-col gap-4 max-w-6xl">
        {/* Vyhledávací pole */}
        <div className="relative w-full">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
              type="text"
              placeholder="Vyhledat podle e-mailu nebo jména..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-sky-500 transition-colors shadow-sm"
          />
        </div>

        {/* Seznam uživatelů */}
        <div className="flex flex-col gap-2">
          {paginatedUsers.length === 0 ? (
              <p className="text-gray-400 p-3 text-center bg-white rounded-xl border border-gray-200">
                Nenalezen žádný uživatel odpovídající „{searchQuery}“.
              </p>
          ) : (
              paginatedUsers.map(user => (
                  <UserTab
                      key={user.id}
                      id={user.id}
                      first_name={user.first_name}
                      last_name={user.last_name}
                      email={user.email}
                      role={user.role}
                      profiles={user.profiles_count ?? 0}
                      created_at={user.created_at ?? ""}
                  />
              ))
          )}
        </div>

        {/* Ovládací lišta stránkování */}
        {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-sm text-gray-500">
                Zobrazeno {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} z {filteredUsers.length} uživatelů
              </p>

              <div className="flex items-center gap-1.5">
                {/* Předchozí stránka */}
                <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <RiArrowLeftSLine size={20} />
                </button>

                {/* Čísla stránek */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            currentPage === page
                                ? 'bg-sky-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                ))}

                {/* Další stránka */}
                <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <RiArrowRightSLine size={20} />
                </button>
              </div>
            </div>
        )}
      </div>
  )
}