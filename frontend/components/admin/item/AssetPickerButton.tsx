'use client';

import { useState } from 'react';
import { RiImageAddLine, RiCloseLine } from 'react-icons/ri';
import ItemPicker from './ItemPicker';
import type { Item } from '@/lib/types';

interface AssetPickerButtonProps {
    value?: Item | null;
    onChange: (item: Item) => void;
    onClear?: () => void;
    label?: string;
    itemCategoryId: number;
}

export default function AssetPickerButton({ value, onChange, onClear, label = 'Vybrat předmět', itemCategoryId }: AssetPickerButtonProps) {
    const [open, setOpen] = useState(false);
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

    const previewSrc = value?.image ? (value.image.startsWith('http') ? value.image : `${apiBase}${value.image}`) : null;

    return (
        <>
            <div className="flex flex-col gap-2">
                {previewSrc ? (
                    <div className="relative group w-40 h-40 rounded-xl overflow-hidden border-3 border-green-700 shadow-sm bg-gray-50">
                        <img src={previewSrc} alt={value?.name ?? ''} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button type="button" onClick={() => setOpen(true)}
                                className="px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg shadow hover:bg-gray-50 transition">
                                Změnit
                            </button>
                            {onClear && (
                                <button type="button" onClick={onClear}
                                    className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
                                    <RiCloseLine size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={() => setOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-green-700 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all w-fit">
                        <RiImageAddLine size={18} />
                        {label}
                    </button>
                )}
                {value && <p className="text-xs text-gray-400 truncate max-w-40">{value.name}</p>}
            </div>

            <ItemPicker
                open={open}
                onClose={() => setOpen(false)}
                onSelect={onChange}
                selected={value?.id ?? null}
                categoryId={itemCategoryId}
            />
        </>
    );
}