'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getItem, updateItem } from '@/lib/api/items'
import MediaPickerButton from '@/components/admin/MediaPickerButton'
import type { MediaItem } from '@/lib/types'

export default function EditItem({ categoryId, itemId }: { categoryId: number; itemId: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [image, setImage] = useState<MediaItem | null>(null)
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

    const [form, setForm] = useState({
        name: '',
        price: 0,
        description: '',
        item_unlock_level: '',
    })

    useEffect(() => {
        getItem(itemId).then(item => {
            setForm({
                name: item.name ?? '',
                price: item.price ?? 0,
                description: item.description ?? '',
                item_unlock_level: item.item_unlock_level ? String(item.item_unlock_level) : '',
            })
            // Pokud má item obrázek, zobraz ho jako MediaItem
            if (item.image) {
                setImage({ id: 0, filename: item.image.split('/').pop(), path: item.image, mime_type: 'image/*', size: 0, created_at: '' })
            }
            setFetching(false)
        })
    }, [itemId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await updateItem(itemId, {
                name: form.name,
                price: Number(form.price),
                description: form.description || null,
                image: image?.path ?? null,
                item_unlock_level: form.item_unlock_level ? Number(form.item_unlock_level) : null,
            })
            router.back();
        } catch {
            setError('Nepodařilo se uložit předmět.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <p className="text-lg text-gray-400 p-6 cus-font-impacted uppercase">Načítám...</p>

    return (
        <div className="max-w-xl ml-5">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Obrázek */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Obrázek</label>
                    <MediaPickerButton value={image} onChange={setImage} label="Vybrat obrázek předmětu" />
                </div>

                {/* Název */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Název</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Název předmětu"
                        className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
                    />
                </div>

                {/* Popis */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Popis <span className="text-gray-300">(volitelné)</span></label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Krátký popis..."
                        className="text-lg text-gray-900 outline-none placeholder:text-gray-300 resize-none"
                    />
                </div>

                {/* Cena + Level */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Cena (body)</label>
                        <input
                            name="price"
                            type="number"
                            min={0}
                            value={form.price}
                            onChange={handleChange}
                            className="text-lg text-gray-900 outline-none"
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Odemkne na levelu <span className="text-gray-300">(volitelné)</span></label>
                        <input
                            name="item_unlock_level"
                            type="number"
                            min={1}
                            value={form.item_unlock_level}
                            onChange={handleChange}
                            placeholder="—"
                            className="text-lg text-gray-900 outline-none placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-sky-600 hover:bg-sky-800 text-white font-semibold py-4 px-4 rounded-xl disabled:opacity-50"
                >
                    {loading ? 'Ukládám...' : 'Uložit změny'}
                </button>
            </form>
        </div>
    )
}