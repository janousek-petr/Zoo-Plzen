'use client';

import { useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

interface MediaFullscreenModalProps {
    url: string;
    onClose: () => void;
}

export default function MediaFullscreenModal({ url, onClose }: MediaFullscreenModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
            >
                <RiCloseLine size={32} />
            </button>

            <img
                src={url}
                alt="Zvětšený náhled"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}