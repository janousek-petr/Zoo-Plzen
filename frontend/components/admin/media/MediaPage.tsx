'use client';

import { useState, useEffect, useRef } from 'react';
import { getMedia, uploadMedia, deleteMedia} from '@/lib/api/media'
import { MediaItem } from '@/lib/types'
import {
  RiUploadCloud2Line,
  RiDeleteBin6Line,
  RiImageLine,
  RiFileCopyLine,
  RiMusic2Line,
} from 'react-icons/ri';

const isAudio = (mime?: string) => !!mime && mime.startsWith('audio/');

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const data = await getMedia();
      setMedia(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadMedia(file);
      await fetchMedia();
    } catch (err: any) {
      const message = err?.response?.data?.message
        || err?.response?.data?.errors?.file?.[0]
        || 'Chyba při nahrávání';
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
        if (!confirm('Smazat soubor?')) return;
        try {
            await deleteMedia(id);
        } catch (err) {
            console.error('delete error', err);
        }
        setMedia(prev => prev.filter(m => m.id !== id));
        if (selected === id) setSelected(null);
    };

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedItem = media.find(m => m.id === selected);
  const formatSize = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

  return (
    <div className="flex">
      {/* Galerie */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer"
          >
            <RiUploadCloud2Line />
            {uploading ? 'Nahrávám...' : 'Nahrát soubor'}
          </button>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {loading ? (
          <div className="py-20 text-gray-400 text-lg cus-font-impacted uppercase">Načítám...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <RiImageLine className="text-6xl mx-auto mb-4" />
            <p>Žádné soubory</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 xl:grid-cols-6 gap-3">
            {media.map(item => {
              const audio = isAudio(item.mime_type);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item.id === selected ? null : item.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selected === item.id
                      ? 'border-green-500 ring-2 ring-green-300'
                      : 'border-transparent hover:border-gray-300'
                  } ${audio ? 'bg-gray-100 flex flex-col items-center justify-center gap-1' : ''}`}
                >
                  {audio ? (
                    <>
                      <RiMusic2Line className="text-3xl text-gray-400" />
                      <span className="text-[10px] text-gray-500 px-1 truncate w-full text-center">
                        {item.filename}
                      </span>
                    </>
                  ) : (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.path}`}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="absolute right-10 w-72 bg-white rounded-xl border border-gray-200 p-4">
          {isAudio(selectedItem.mime_type) ? (
            <div className="w-full rounded-lg mb-4 bg-gray-50 p-4 flex flex-col items-center gap-3">
              <RiMusic2Line className="text-5xl text-gray-400" />
              <audio
                controls
                src={`${process.env.NEXT_PUBLIC_API_URL}${selectedItem.path}`}
                className="w-full"
              />
            </div>
          ) : (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${selectedItem.path}`}
              alt={selectedItem.filename}
              className="w-full rounded-lg mb-4 object-cover"
            />
          )}
          <p className="font-medium text-gray-800 text-sm break-all mb-1">
            {selectedItem.filename}
          </p>
          <p className="text-xs text-gray-500 mb-1">{selectedItem.mime_type}</p>
          <p className="text-xs text-gray-500 mb-4">{formatSize(selectedItem.size)}</p>

          <button
            onClick={() => handleCopy(selectedItem.path)}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 mb-2"
          >
            <RiFileCopyLine />
            {copied ? 'Zkopírováno!' : 'Kopírovat URL'}
          </button>
          <button
            onClick={() => handleDelete(selectedItem.id)}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm py-2 rounded-lg hover:bg-red-100"
          >
            <RiDeleteBin6Line />
            Smazat
          </button>
        </div>
      )}
    </div>
  );
}