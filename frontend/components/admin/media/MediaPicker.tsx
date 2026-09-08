'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    RiCheckLine,
    RiCloseLine,
    RiImageLine,
    RiLoader4Line,
    RiMusic2Line,
    RiUpload2Line,
} from 'react-icons/ri';
import { getMedia, getStorageUrl, uploadMedia } from '@/lib/api/media';
import { MediaItem } from '@/lib/types';
import Pagination from "@/components/admin/Pagination";
import MediaFilterBar, { TypeFilter, SortOption } from "@/components/admin/media/MediaFilterBar";

interface MediaPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (item: MediaItem) => void;
    selected?: number | null;
    allowedType?: AllowedType;
}

type AllowedType = 'all' | 'image' | 'audio';
const isAudio = (mime?: string) => !!mime && mime.startsWith('audio/');
const ITEMS_PER_PAGE = 12;

export default function MediaPicker({
                                        open,
                                        onClose,
                                        onSelect,
                                        selected,
                                        allowedType = 'all'
                                    }: MediaPickerProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [highlighted, setHighlighted] = useState<number | null>(selected ?? null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [activeFilter, setActiveFilter] = useState<AllowedType>(allowedType);
    const [currentPage, setCurrentPage] = useState(1);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getMedia();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (open) {
            load();
            setHighlighted(selected ?? null);
            setSearch('');
            setActiveFilter(allowedType);
            setSortBy('newest');
            setCurrentPage(1);
        }
    }, [open, selected, allowedType, load]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Určí aktuálně aplikovaný filtr (z props nebo ze záložek)
    const currentTypeFilter = allowedType !== 'all' ? allowedType : activeFilter;

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleTypeFilterChange = (filter: TypeFilter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    // 1. Filtrování
    const filtered = items
        .filter(i => {
            if (currentTypeFilter === 'image') return !isAudio(i.mime_type);
            if (currentTypeFilter === 'audio') return isAudio(i.mime_type);
            return true;
        })
        .filter(i => (i.filename ?? '').toLowerCase().includes(search.toLowerCase()));

    // 2. Řazení
    const sortedMediaItems = [...filtered].sort((a, b) => {
        if (sortBy === 'newest') return b.id - a.id;
        if (sortBy === 'oldest') return a.id - b.id;
        if (sortBy === 'name') return (a.filename ?? '').localeCompare(b.filename ?? '');
        if (sortBy === 'size') return b.size - a.size;
        return 0;
    });

    // 3. Stránkování
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMediaItems = sortedMediaItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(sortedMediaItems.length / ITEMS_PER_PAGE);

    const handleUpload = async (files: FileList | null) => {
        if (!files?.length) return;
        const file = files[0];

        if (currentTypeFilter === 'image' && isAudio(file.type)) {
            alert('V tomto režimu lze nahrát pouze obrázky.');
            return;
        }
        if (currentTypeFilter === 'audio' && !isAudio(file.type)) {
            alert('V tomto režimu lze nahrát pouze audio soubory.');
            return;
        }

        setUploading(true);
        try {
            const uploaded = await uploadMedia(file);
            setItems(prev => [uploaded, ...prev]);
            setHighlighted(uploaded.id);
        } catch (err) {
            console.error('Upload selhal:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleConfirm = () => {
        const item = items.find(i => i.id === highlighted);
        if (item) {
            onSelect(item);
            onClose();
        }
    };

    const fmt = (b: number) =>
        b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

    if (!open) return null;

    const highlightedItem = items.find(x => x.id === highlighted);

    const getAcceptAttr = () => {
        if (currentTypeFilter === 'image') return "image/*";
        if (currentTypeFilter === 'audio') return "audio/*";
        return "image/*,audio/*";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
            <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                            <RiImageLine size={20}/>
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Výběr souboru</h2>
                            <p className="text-xs text-gray-400">{filtered.length} z {items.length} souborů v knihovně</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <RiCloseLine size={20}/>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex-1 min-w-[240px]">
                        <MediaFilterBar
                            searchQuery={search}
                            typeFilter={currentTypeFilter}
                            sortBy={sortBy}
                            onSearchChange={handleSearchChange}
                            onTypeFilterChange={handleTypeFilterChange}
                            onSortChange={handleSortChange}
                            hideTypeFilter={allowedType !== 'all'} // Pokud je allowedType 'image' nebo 'audio', výběr typu se skryje
                        />
                    </div>

                    {/* Upload */}
                    <label className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all shrink-0
                        ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'}`}>
                        {uploading ? <RiLoader4Line size={16} className="animate-spin"/> : <RiUpload2Line size={16}/>}
                        {uploading ? 'Nahrávám...' : 'Nahrát soubor'}
                        <input
                            type="file"
                            accept={getAcceptAttr()}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                            onChange={e => handleUpload(e.target.files)}
                        />
                    </label>
                </div>

                {/* Grid */}
                <div className={`flex-1 overflow-y-auto p-6 transition-colors ${dragOver ? 'bg-emerald-50/60' : ''}`}
                     onDragOver={e => {
                         e.preventDefault();
                         setDragOver(true);
                     }}
                     onDragLeave={() => setDragOver(false)}
                     onDrop={e => {
                         e.preventDefault();
                         setDragOver(false);
                         handleUpload(e.dataTransfer.files);
                     }}>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
                            <RiLoader4Line size={28} className="animate-spin"/>
                            <span className="text-sm">Načítám knihovnu...</span>
                        </div>
                    ) : paginatedMediaItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
                            <RiImageLine size={36}/>
                            <span className="text-sm">{search ? 'Žádné výsledky' : 'Knihovna je prázdná'}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {paginatedMediaItems.map(item => {
                                const isSel = highlighted === item.id;
                                const audio = isAudio(item.mime_type);
                                return (
                                    <button key={item.id}
                                            type="button"
                                            onClick={() => setHighlighted(item.id)}
                                            onDoubleClick={() => {
                                                setHighlighted(item.id);
                                                onSelect(item);
                                                onClose();
                                            }}
                                            title={`${item.filename}\n${fmt(item.size)}`}
                                            className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all focus:outline-none
                                            ${isSel ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md scale-[1.03]' : 'border-transparent hover:border-gray-300 hover:shadow-sm'}
                                            ${audio ? 'bg-gray-100 flex flex-col items-center justify-center gap-1.5' : ''}`}>
                                        {audio ? (
                                            <>
                                                <RiMusic2Line size={26} className="text-gray-400"/>
                                                <span className="text-[9px] text-gray-500 px-1.5 truncate w-full text-center">
                                                    {item.filename}
                                                </span>
                                            </>
                                        ) : (
                                            <img src={getStorageUrl(item.path)} alt={item.filename}
                                                 className="w-full h-full object-cover" loading="lazy"/>
                                        )}
                                        <div className={`absolute inset-0 bg-black/40 flex items-end p-1.5 transition-opacity
                                            ${isSel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <span className="text-white text-[10px] leading-tight truncate w-full">{item.filename}</span>
                                        </div>
                                        {isSel && (
                                            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full shadow">
                                                <RiCheckLine size={12} className="text-white"/>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Stránkování */}
                    {totalPages > 1 && (
                        <div className="pt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={sortedMediaItems.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                            />
                        </div>
                    )}

                    {dragOver && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-2 bg-white/90 rounded-2xl px-8 py-6 shadow-xl border-2 border-dashed border-emerald-400">
                                <RiUpload2Line size={32} className="text-emerald-500"/>
                                <span className="text-sm font-medium text-emerald-700">Pusť soubor pro nahrání</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Audio preview */}
                {highlightedItem && isAudio(highlightedItem.mime_type) && (
                    <div
                        className="px-6 py-3 border-t border-gray-100 bg-white"
                        onClick={e => e.stopPropagation()}
                        onMouseDown={e => e.stopPropagation()}
                    >
                        <audio
                            key={highlightedItem.id}
                            controls
                            src={getStorageUrl(highlightedItem.path)}
                            className="w-full h-9"
                        />
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <span className="text-sm text-gray-400">
                        {highlightedItem
                            ? `${highlightedItem.filename} (${fmt(highlightedItem.size)})`
                            : 'Žádný soubor není vybrán — dvojklikem vyber a potvrď'}
                    </span>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Zrušit
                        </button>
                        <button type="button" onClick={handleConfirm} disabled={!highlighted}
                                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all
                                ${highlighted ? 'bg-emerald-700 text-white hover:bg-emerald-700 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            Vybrat soubor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}