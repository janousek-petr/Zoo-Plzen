'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getItems, deleteItem } from '@/lib/api/items'
import { RiEditLine, RiDeleteBinLine, RiShoppingBagLine, RiAddLine } from 'react-icons/ri'
import type { Item } from '@/lib/types'

export default function ItemList({ categoryId }: { categoryId: number }) {
    const router = useRouter()
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

    useEffect(() => {
        getItems().then((data: Item[]) => {
            setItems(data.filter((i: Item) => i.category?.id === categoryId))
            setLoading(false)
        })
    }, [categoryId])

    const handleDelete = async (e: React.MouseEvent, item: Item) => {
        e.stopPropagation()
        if (!confirm(`Smazat "${item.name}"?`)) return
        try {
            await deleteItem(item.id)
            setItems(prev => prev.filter(i => i.id !== item.id))
        } catch {
            alert('Nepodařilo se smazat předmět.')
        }
    }

    if (loading) return <p className="text-gray-400 p-6">Načítám...</p>

    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={() => router.push(`/admin/items/${categoryId}/new`)}
                className="flex items-center gap-2 self-start px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl transition-colors"
            >
                <RiAddLine /> Přidat předmět
            </button>

            {!items.length
                ? <p className="text-gray-400">Žádné předměty v této kategorii.</p>
                : (
                    <div className="grid grid-cols-7 gap-3">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                                onClick={() => router.push(`/admin/items/${categoryId}/${item.id}/edit`)}
                            >
                                <div className="w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {item.image
                                        ? <img src={`${apiBase}${item.image}`} alt={item.name} className="object-contain w-full h-full" />
                                        : <RiShoppingBagLine className="text-gray-300 text-5xl" />
                                    }
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-400">{item.price} bodů</p>
                                    {item.item_unlock_level && (
                                        <p className="text-sm text-gray-400">Level {item.item_unlock_level}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={e => { e.stopPropagation(); router.push(`/admin/items/${categoryId}/${item.id}/edit`) }}
                                        className="flex items-center gap-1 text-sm text-white px-2 py-1 rounded bg-sky-600 hover:bg-sky-800"
                                    >
                                        <RiEditLine /> Upravit
                                    </button>
                                    <button
                                        onClick={e => handleDelete(e, item)}
                                        className="ml-auto text-red-600 hover:text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        <RiDeleteBinLine />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}