'use client';

import { useEffect, useState } from 'react';
import { RiCloseLine, RiSearchLine, RiCheckLine, RiShoppingBagLine, RiLoader4Line } from 'react-icons/ri';
import { getItems } from '@/lib/api/items';
import type { Item } from '@/lib/types';

interface ItemPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (item: Item) => void;
    selected?: number | null;
    categoryId: number;
}

export default function ItemPicker({ open, onClose, onSelect, selected, categoryId }: ItemPickerProps) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [highlighted, setHighlighted] = useState<number | null>(selected ?? null);
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

    useEffect(() => {
        if (!open) return;
        setSearch('');
        setHighlighted(selected ?? null);
        setLoading(true);
        getItems()
            .then((data: Item[]) => setItems(data.filter(i => i.category?.id === categoryId)))
            .finally(() => setLoading(false));
    }, [open, selected, categoryId]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const highlightedItem = items.find(i => i.id === highlighted);

    const handleConfirm = () => {
        const item = items.find(i => i.id === highlighted);
        if (item) { onSelect(item); onClose(); }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 text-sky-600">
                            <RiShoppingBagLine size={20} />
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Výběr předmětu</h2>
                            <p className="text-xs text-gray-400">{items.length} předmětů v kategorii</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <RiCloseLine size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative flex-1 max-w-xs">
                        <RiSearchLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Hledat podle názvu..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
                            <RiLoader4Line size={28} className="animate-spin" />
                            <span className="text-sm">Načítám předměty...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
                            <RiShoppingBagLine size={36} />
                            <span className="text-sm">{search ? 'Žádné výsledky' : 'V této kategorii nejsou žádné předměty'}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {filtered.map(item => {
                                const isSel = highlighted === item.id;
                                return (
                                    <button key={item.id}
                                        type="button"
                                        onClick={() => setHighlighted(item.id)}
                                        onDoubleClick={() => { setHighlighted(item.id); onSelect(item); onClose(); }}
                                        title={item.name}
                                        className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all focus:outline-none bg-gray-50
                                            ${isSel ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-md scale-[1.03]' : 'border-transparent hover:border-gray-300 hover:shadow-sm'}`}>
                                        {item.image ? (
                                            <img src={`${apiBase}${item.image}`} alt={item.name}
                                                className="w-full h-full object-contain" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <RiShoppingBagLine className="text-gray-300 text-3xl" />
                                            </div>
                                        )}
                                        <div className={`absolute inset-0 bg-black/40 flex items-end p-1.5 transition-opacity
                                            ${isSel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <span className="text-white text-[10px] leading-tight truncate w-full">{item.name}</span>
                                        </div>
                                        {isSel && (
                                            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 bg-sky-500 rounded-full shadow">
                                                <RiCheckLine size={12} className="text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <span className="text-sm text-gray-400">
                        {highlightedItem ? highlightedItem.name : 'Žádný předmět není vybrán — dvojklikem vyber a potvrď'}
                    </span>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Zrušit
                        </button>
                        <button type="button" onClick={handleConfirm} disabled={!highlighted}
                            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all
                                ${highlighted ? 'bg-sky-600 text-white hover:bg-sky-700 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            Vybrat předmět
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}