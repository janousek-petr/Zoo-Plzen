'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTexts, deleteText } from '@/lib/api/texts'
import {
  RiEditLine,
  RiDeleteBinLine,
  RiMapPinLine,
  RiArrowDownSLine,
  RiSearchLine,
  RiAddLine,
  RiCloseLine,
} from 'react-icons/ri'
import type { RegionInfo } from '@/lib/types'

const LEVEL_LABEL: Record<number, string> = {
  1: 'Základní info',
  2: 'Další info',
  3: 'Fun fact',
}

const LEVEL_BADGE: Record<number, string> = {
  1: 'bg-green-50 text-green-800',
  2: 'bg-amber-50 text-amber-800',
  3: 'bg-red-50 text-red-800',
}

function groupByRegion(texts: RegionInfo[]) {
  return texts.reduce<Record<string, RegionInfo[]>>((acc, item) => {
    const region = item.region?.name ?? 'Žádná oblast'
    if (!acc[region]) acc[region] = []
    acc[region].push(item)
    return acc
  }, {})
}

function sortedRegionEntries(grouped: Record<string, RegionInfo[]>) {
  return Object.entries(grouped).sort(([a], [b]) => {
    if (a === 'Žádná oblast') return 1
    if (b === 'Žádná oblast') return -1
    return a.localeCompare(b, 'cs')
  })
}

export default function RegionInfoList() {
  const router = useRouter()
  const [texts, setTexts] = useState<RegionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({})
  const [previewItem, setPreviewItem] = useState<RegionInfo | null>(null)

  useEffect(() => {
    getTexts().then(data => {
      setTexts(data ?? [])
      const grouped = groupByRegion(data ?? [])
      setOpenRegions(Object.fromEntries(Object.keys(grouped).map(r => [r, true])))
      setLoading(false)
    })
  }, [])

  const toggleRegion = (region: string) => {
    setOpenRegions(prev => ({ ...prev, [region]: !prev[region] }))
  }

  const handleDelete = async (e: React.MouseEvent, item: RegionInfo) => {
    e.stopPropagation()
    if (!confirm('Opravdu chceš smazat tento text?')) return
    try {
      await deleteText(item.id)
      setTexts(prev => prev.filter(t => t.id !== item.id))
      setPreviewItem(prev => (prev?.id === item.id ? null : prev))
    } catch {
      alert('Nepodařilo se smazat text.')
    }
  }

  const filteredTexts = useMemo(() => {
    if (!search.trim()) return texts
    const q = search.trim().toLowerCase()
    return texts.filter(t =>
      t.text.toLowerCase().includes(q) ||
      (t.region?.name ?? '').toLowerCase().includes(q)
    )
  }, [texts, search])

  if (loading) return <p className="text-lg text-gray-400 p-6 cus-font-impacted">Načítám...</p>

  const grouped = groupByRegion(filteredTexts)
  const isFiltering = search.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <RiSearchLine className="text-gray-400 text-lg" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hledat v textech nebo podle oblasti..."
            className="flex-1 text-lg text-gray-900 outline-none placeholder:text-gray-300"
          />
        </div>
        <button
          onClick={() => router.push('/admin/texts/region-infos/create')}
          className="flex items-center gap-1 text-lg text-white px-4 py-3 rounded-xl bg-green-700 hover:bg-green-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          <RiAddLine /> Přidat text
        </button>
      </div>

      {sortedRegionEntries(grouped).length === 0 && (
        <p className="text-lg text-gray-400 p-6">Nic nenalezeno.</p>
      )}

      {sortedRegionEntries(grouped).map(([region, items]) => {
        const isOpen = isFiltering ? true : (openRegions[region] ?? true)
        const byLevel: Record<number, RegionInfo[]> = { 1: [], 2: [], 3: [] }
        items.forEach(item => {
          if (byLevel[item.level]) byLevel[item.level].push(item)
        })

        return (
          <div key={region} className="border border-gray-200 rounded-xl overflow-hidden">

            <button
              onClick={() => toggleRegion(region)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <RiMapPinLine className="text-gray-600 text-lg" />
              <h2 className="text-xl text-gray-600 uppercase cus-font-impacted flex-1 text-left">{region}</h2>
              <span className="text-sm text-gray-400">{items.length} {items.length === 1 ? 'text' : 'textů'}</span>
              <RiArrowDownSLine className={`text-gray-400 text-3xl transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>

            {isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
                {[1, 2, 3].map(level => (
                  <div key={level} className="flex flex-col gap-2">
                    <p className={`text-sm font-medium px-2 py-1 rounded-full w-fit ${LEVEL_BADGE[level]}`}>
                      {LEVEL_LABEL[level]}
                    </p>

                    {byLevel[level].length === 0 && (
                      <p className="text-sm text-gray-300 px-1">Žádný text.</p>
                    )}

                    {byLevel[level].map(item => (
                      <div
                        key={item.id}
                        onClick={() => setPreviewItem(item)}
                        className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2 hover:bg-gray-50 hover:border-gray-400 duration-100 cursor-pointer"
                      >
                        <p className="text-md text-gray-700 line-clamp-4">{item.text}</p>

                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/admin/texts/region-infos/${item.id}/edit`) }}
                            className="flex items-center gap-1 text-md text-white border-2 border-transparent px-2 py-1 rounded bg-sky-600 hover:bg-sky-800 hover:border-sky-800 transition-colors cursor-pointer"
                          >
                            <RiEditLine /> Upravit
                          </button>
                          <button
                            onClick={e => handleDelete(e, item)}
                            className="flex items-center h-full gap-1 text-lg text-red-600 hover:text-white border-2 border-transparent px-2 py-1 rounded hover:bg-red-600 transition-colors ml-auto cursor-pointer"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

          </div>
        )
      })}

      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl p-5 max-w-lg w-full max-h-[80vh] flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium px-2 py-1 rounded-full ${LEVEL_BADGE[previewItem.level] ?? 'bg-gray-100 text-gray-600'}`}>
                  {LEVEL_LABEL[previewItem.level] ?? `Level ${previewItem.level}`}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <RiMapPinLine /> {previewItem.region?.name ?? 'Žádná oblast'}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl cursor-pointer"
              >
                <RiCloseLine />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <p className="text-lg text-gray-800 whitespace-pre-wrap break-all">
                    {previewItem.text}
                </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => router.push(`/admin/texts/region-infos/${previewItem.id}/edit`)}
                className="flex items-center gap-1 text-md text-white border-2 border-transparent px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-800 hover:border-sky-800 transition-colors cursor-pointer"
              >
                <RiEditLine /> Upravit
              </button>
              <button
                onClick={e => handleDelete(e, previewItem)}
                className="flex items-center gap-1 text-md text-red-600 hover:text-white border-2 border-transparent px-3 py-1.5 rounded hover:bg-red-600 transition-colors ml-auto cursor-pointer"
              >
                <RiDeleteBinLine /> Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}