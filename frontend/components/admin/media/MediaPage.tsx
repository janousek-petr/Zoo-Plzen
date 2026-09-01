'use client';

import { useState, useEffect, useRef } from 'react';
import { getMedia, uploadMedia, deleteMedia, getStorageUrl } from '@/lib/api/media';
import { MediaItem } from '@/lib/types';
import {
  RiUploadCloud2Line,
  RiDeleteBin6Line,
  RiImageLine,
  RiFileCopyLine,
  RiMusic2Line,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiFullscreenLine,
  RiCloseLine,
} from 'react-icons/ri';

const isAudio = (mime?: string) => !!mime && mime.startsWith('audio/');
const ITEMS_PER_PAGE = 12;

type TypeFilter = 'all' | 'image' | 'audio';
type SortOption = 'newest' | 'oldest' | 'name' | 'size';

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stav pro Fullscreen náhled obrázku
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  // Ovládání seznamu
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Zavření fullscreenu klávesou ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenUrl(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (filter: TypeFilter) => {
    setTypeFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // 1. Filtrování
  const filteredMedia = media.filter(m => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (m.filename ?? '').toLowerCase().includes(query);
    const audio = isAudio(m.mime_type);

    if (!matchesSearch) return false;
    if (typeFilter === 'image' && audio) return false;
    if (typeFilter === 'audio' && !audio) return false;

    return true;
  });

  // 2. Řazení
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'name') return (a.filename ?? '').localeCompare(b.filename ?? '');
    if (sortBy === 'size') return b.size - a.size;
    return 0;
  });

  // 3. Stránkování
  const totalPages = Math.ceil(sortedMedia.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedia = sortedMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      <div className="flex gap-6">
        {/* Galerie */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="flex items-center gap-4">
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

          {/* Lišta vyhledávání, typu a řazení */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                  type="text"
                  placeholder="Vyhledat podle názvu..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 outline-none focus:border-sky-500 transition-colors shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm shrink-0">
                <button
                    type="button"
                    onClick={() => handleTypeFilterChange('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        typeFilter === 'all' ? 'bg-sky-600 text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Vše
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeFilterChange('image')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        typeFilter === 'image' ? 'bg-sky-600 text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Obrázky
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeFilterChange('audio')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        typeFilter === 'audio' ? 'bg-sky-600 text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Audio
                </button>
              </div>

              <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-sky-500 shadow-sm cursor-pointer h-full"
              >
                <option value="newest">Nejnovější</option>
                <option value="oldest">Nejstarší</option>
                <option value="name">Název (A–Z)</option>
                <option value="size">Velikost</option>
              </select>
            </div>
          </div>

          {loading ? (
              <div className="py-20 text-gray-400 text-lg cus-font-impacted uppercase">Načítám...</div>
          ) : sortedMedia.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white border border-gray-200 rounded-xl">
                <RiImageLine className="text-6xl mx-auto mb-4" />
                <p>Žádné odpovídající soubory</p>
              </div>
          ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-4 xl:grid-cols-6 gap-3">
                  {paginatedMedia.map(item => {
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
                                  src={getStorageUrl(item.path)}
                                  alt={item.filename}
                                  className="w-full h-full object-cover"
                              />
                          )}
                        </div>
                    );
                  })}
                </div>

                {/* Stránkování */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <p className="text-sm text-gray-500">
                        Zobrazeno {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, sortedMedia.length)} z {sortedMedia.length} souborů
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <RiArrowLeftSLine size={20} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                    currentPage === page
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <RiArrowRightSLine size={20} />
                        </button>
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && (
            <div className="w-72 bg-white rounded-xl border border-gray-200 p-4 shrink-0 h-fit sticky top-6">
              {isAudio(selectedItem.mime_type) ? (
                  <div className="w-full rounded-lg mb-4 bg-gray-50 p-4 flex flex-col items-center gap-3">
                    <RiMusic2Line className="text-5xl text-gray-400" />
                    <audio
                        controls
                        src={getStorageUrl(selectedItem.path)}
                        className="w-full"
                    />
                  </div>
              ) : (
                  <div className="relative group mb-4">
                    <img
                        src={getStorageUrl(selectedItem.path)}
                        alt={selectedItem.filename}
                        className="w-full rounded-lg object-cover max-h-48 cursor-pointer"
                        onClick={() => setFullscreenUrl(getStorageUrl(selectedItem.path))}
                    />
                    {/* Ikona zvětšení přímo na náhledu */}
                    <button
                        type="button"
                        onClick={() => setFullscreenUrl(getStorageUrl(selectedItem.path))}
                        className="absolute right-2 bottom-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Otevřít přes celou obrazovku"
                    >
                      <RiFullscreenLine size={18} />
                    </button>
                  </div>
              )}

              <p className="font-medium text-gray-800 text-sm break-all mb-1">
                {selectedItem.filename}
              </p>
              <p className="text-xs text-gray-500 mb-1">{selectedItem.mime_type}</p>
              <p className="text-xs text-gray-500 mb-4">{formatSize(selectedItem.size)}</p>

              {/* Tlačítko pro fullscreen pro obrázky v tlačítkovém menu */}
              {!isAudio(selectedItem.mime_type) && (
                  <button
                      onClick={() => setFullscreenUrl(getStorageUrl(selectedItem.path))}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 mb-2 cursor-pointer font-medium text-gray-700"
                  >
                    <RiFullscreenLine />
                    Zobrazit naplno
                  </button>
              )}

              <button
                  onClick={() => handleCopy(selectedItem.path)}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 mb-2 cursor-pointer"
              >
                <RiFileCopyLine />
                {copied ? 'Zkopírováno!' : 'Kopírovat URL'}
              </button>
              <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm py-2 rounded-lg hover:bg-red-100 cursor-pointer"
              >
                <RiDeleteBin6Line />
                Smazat
              </button>
            </div>
        )}

        {/* Modal okno pro obraz přes celou stránku */}
        {fullscreenUrl && (
            <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setFullscreenUrl(null)}
            >
              {/* Tlačítko zavřít vpravo nahoře */}
              <button
                  type="button"
                  onClick={() => setFullscreenUrl(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              >
                <RiCloseLine size={32} />
              </button>

              {/* Zvětšený obrázek */}
              <img
                  src={fullscreenUrl}
                  alt="Zvětšený náhled"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
                  onClick={(e) => e.stopPropagation()} // Kliknutí na samotný obrázek okno nezavře
              />
            </div>
        )}
      </div>
  );
}