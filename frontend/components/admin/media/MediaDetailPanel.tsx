'use client';

import { useState } from 'react';
import { MediaItem } from '@/lib/types';
import { getStorageUrl } from '@/lib/api/media';
import { RiMusic2Line, RiFullscreenLine, RiFileCopyLine, RiDeleteBin6Line } from 'react-icons/ri';

interface MediaDetailPanelProps {
    item: MediaItem;
    isAudio: boolean;
    onFullscreen: (url: string) => void;
    onDelete: (id: number) => void;
}

export default function MediaDetailPanel({ item, isAudio, onFullscreen, onDelete }: MediaDetailPanelProps) {
    const [copied, setCopied] = useState(false);
    const fileUrl = getStorageUrl(item.path);

    const handleCopy = () => {
        navigator.clipboard.writeText(fileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatSize = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

    return (
        <div className="w-72 bg-white rounded-xl border border-gray-200 p-4 shrink-0 h-fit sticky top-6">
            {isAudio ? (
                <div className="w-full rounded-lg mb-4 bg-gray-50 p-4 flex flex-col items-center gap-3">
                    <RiMusic2Line className="text-5xl text-gray-400" />
                    <audio controls src={fileUrl} className="w-full" />
                </div>
            ) : (
                <div className="relative group mb-4">
                    <img
                        src={fileUrl}
                        alt={item.filename}
                        className="w-full rounded-lg object-cover max-h-48 cursor-pointer"
                        onClick={() => onFullscreen(fileUrl)}
                    />
                    <button
                        type="button"
                        onClick={() => onFullscreen(fileUrl)}
                        className="absolute right-2 bottom-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Otevřít přes celou obrazovku"
                    >
                        <RiFullscreenLine size={18} />
                    </button>
                </div>
            )}

            <p className="font-medium text-gray-800 text-sm break-all mb-1">{item.filename}</p>
            <p className="text-xs text-gray-500 mb-1">{item.mime_type}</p>
            <p className="text-xs text-gray-500 mb-4">{formatSize(item.size)}</p>

            {!isAudio && (
                <button
                    onClick={() => onFullscreen(fileUrl)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 mb-2 cursor-pointer font-medium text-gray-700"
                >
                    <RiFullscreenLine /> Zobrazit naplno
                </button>
            )}

            <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 mb-2 cursor-pointer"
            >
                <RiFileCopyLine /> {copied ? 'Zkopírováno!' : 'Kopírovat URL'}
            </button>

            <button
                onClick={() => onDelete(item.id)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm py-2 rounded-lg hover:bg-red-100 cursor-pointer"
            >
                <RiDeleteBin6Line /> Smazat
            </button>
        </div>
    );
}