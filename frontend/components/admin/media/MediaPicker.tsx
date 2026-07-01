'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    RiCloseLine, RiSearchLine, RiCheckLine,
    RiImageLine, RiUpload2Line, RiLoader4Line, RiMusic2Line,
} from 'react-icons/ri';
import { getMedia, uploadMedia } from '@/lib/api/media';
import { MediaItem } from '@/lib/types'

interface MediaPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (item: MediaItem) => void;
    selected?: number | null;
    onlyImage?: boolean;
}

const isAudio = (mime?: string) => !!mime && mime.startsWith('audio/');

export default function MediaPicker({ open, onClose, onSelect, selected, onlyImage = false}: MediaPickerProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [highlighted, setHighlighted] = useState<number | null>(selected ?? null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await getMedia();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (open) { load(); setHighlighted(selected ?? null); setSearch(''); }
    }, [open, selected, load]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    const filtered = items
        .filter(i => !onlyImage || !isAudio(i.mime_type))
        .filter(i => i.filename.toLowerCase().includes(search.toLowerCase()));

    const handleUpload = async (files: FileList | null) => {
        if (!files?.length) return;
        const file = files[0];
        if (onlyImage && isAudio(file.type)) {
            console.warn('Audio soubory nejsou v tomto režimu povoleny');
            return;
        }
        setUploading(true);
        try {
            const uploaded = await uploadMedia(file);
            setItems(prev => [uploaded, ...prev]);
            setHighlighted(uploaded.id);
        } catch (err) { console.error('Upload selhal:', err); }
        finally { setUploading(false); }
    };

    const handleConfirm = () => {
        const item = items.find(i => i.id === highlighted);
        if (item) { onSelect(item); onClose(); }
    };

    const fmt = (b: number) =>
        b < 1024 ? `${b} B` : b < 1024*1024 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024/1024).toFixed(1)} MB`;

    if (!open) return null;

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';
    const highlightedItem = items.find(x => x.id === highlighted);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                            <RiImageLine size={20} />
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Výběr souboru</h2>
                            <p className="text-xs text-gray-400">{items.length} souborů v knihovně</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <RiCloseLine size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative flex-1 max-w-xs">
                        <RiSearchLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Hledat podle názvu..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition" />
                    </div>
                    <label className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all
                        ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'}`}>
                        {uploading ? <RiLoader4Line size={16} className="animate-spin" /> : <RiUpload2Line size={16} />}
                        {uploading ? 'Nahrávám...' : 'Nahrát soubor'}
                        <input type="file" accept={onlyImage ? "image/*" : "image/*,audio/*"} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading}
                            onChange={e => handleUpload(e.target.files)} />
                    </label>
                </div>

                {/* Grid */}
                <div className={`flex-1 overflow-y-auto p-6 transition-colors ${dragOver ? 'bg-emerald-50/60' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
                            <RiLoader4Line size={28} className="animate-spin" />
                            <span className="text-sm">Načítám knihovnu...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
                            <RiImageLine size={36} />
                            <span className="text-sm">{search ? 'Žádné výsledky' : 'Knihovna je prázdná'}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {filtered.map(item => {
                                const isSel = highlighted === item.id;
                                const audio = isAudio(item.mime_type);
                                return (
                                    <button key={item.id}
                                        type="button"
                                        onClick={() => setHighlighted(item.id)}
                                        onDoubleClick={() => { setHighlighted(item.id); onSelect(item); onClose(); }}
                                        title={`${item.filename}\n${fmt(item.size)}`}
                                        className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all focus:outline-none
                                            ${isSel ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md scale-[1.03]' : 'border-transparent hover:border-gray-300 hover:shadow-sm'}
                                            ${audio ? 'bg-gray-100 flex flex-col items-center justify-center gap-1.5' : ''}`}>
                                        {audio ? (
                                            <>
                                                <RiMusic2Line size={26} className="text-gray-400" />
                                                <span className="text-[9px] text-gray-500 px-1.5 truncate w-full text-center">
                                                    {item.filename}
                                                </span>
                                            </>
                                        ) : (
                                            <img src={`${apiBase}${item.path}`} alt={item.filename}
                                                className="w-full h-full object-cover" loading="lazy" />
                                        )}
                                        <div className={`absolute inset-0 bg-black/40 flex items-end p-1.5 transition-opacity
                                            ${isSel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <span className="text-white text-[10px] leading-tight truncate w-full">{item.filename}</span>
                                        </div>
                                        {isSel && (
                                            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full shadow">
                                                <RiCheckLine size={12} className="text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {dragOver && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-2 bg-white/90 rounded-2xl px-8 py-6 shadow-xl border-2 border-dashed border-emerald-400">
                                <RiUpload2Line size={32} className="text-emerald-500" />
                                <span className="text-sm font-medium text-emerald-700">Pusť soubor pro nahrání</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Audio preview pásek nad footerem, jen pokud je vybrané audio */}
                {highlightedItem && isAudio(highlightedItem.mime_type) && (
                    <div className="px-6 py-3 border-t border-gray-100 bg-white">
                        <audio
                            key={highlightedItem.id}
                            controls
                            src={`${apiBase}${highlightedItem.path}`}
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
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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