'use client';

import { useState, useEffect, useRef } from 'react';
import { getMedia, uploadMedia, deleteMedia, getStorageUrl, checkIfMediaExists } from '@/lib/api/media';
import { MediaItem } from '@/lib/types';
import { RiUploadCloud2Line, RiImageLine, RiMusic2Line } from 'react-icons/ri';
import Pagination from '@/components/admin/Pagination';
import MediaFilterBar, { TypeFilter, SortOption } from '@/components/admin/media/MediaFilterBar';
import MediaDetailPanel from '@/components/admin/media/MediaDetailPanel';
import MediaFullscreenModal from '@/components/admin/media/MediaFullscreenModal';

const isAudio = (mime?: string) => !!mime && mime.startsWith('audio/');
const ITEMS_PER_PAGE = 12;

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const highlightExistingMedia = (targetItem: MediaItem, mediaList: MediaItem[]) => {
    setSearchQuery('');
    setTypeFilter('all');

    const sorted = [...mediaList].sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'name') return (a.filename ?? '').localeCompare(b.filename ?? '');
      if (sortBy === 'size') return b.size - a.size;
      return 0;
    });

    const index = sorted.findIndex(m => m.id === targetItem.id);
    if (index !== -1) {
      setCurrentPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
    }
    setSelected(targetItem.id);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const existingMedia = await checkIfMediaExists(file);

      if (existingMedia) {
        let currentMediaList = media;
        if (!media.some(m => m.id === existingMedia.id)) {
          const freshData = await getMedia();
          setMedia(freshData);
          currentMediaList = freshData;
        }

        highlightExistingMedia(existingMedia, currentMediaList);
        setError(`Soubor "${file.name}" již v knihovně existuje — byl automaticky vybrán.`);
        return;
      }

      await uploadMedia(file);
      await fetchMedia();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.response?.data?.errors?.file?.[0] || 'Chyba při nahrávání';
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

  // Filtrování, řazení a stránkování
  const filteredMedia = media.filter(m => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (m.filename ?? '').toLowerCase().includes(query);
    const audio = isAudio(m.mime_type);

    if (!matchesSearch) return false;
    if (typeFilter === 'image' && audio) return false;
    if (typeFilter === 'audio' && !audio) return false;
    return true;
  });

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'name') return (a.filename ?? '').localeCompare(b.filename ?? '');
    if (sortBy === 'size') return b.size - a.size;
    return 0;
  });

  const totalPages = Math.ceil(sortedMedia.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedia = sortedMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const selectedItem = media.find(m => m.id === selected);

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
            {error && <p className="text-sm text-red-600">{error}</p>}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*"
                className="hidden"
                onChange={handleUpload}
            />
            <p className="text-sm text-gray-600">
              Maximální povolená velikost souboru je 20 MB. Podporované typy souborů: jpg, jpeg, png, webp, mp3, wav, ogg, m4a, aac.
            </p>
          </div>

          {/* Lišta vyhledávání, typu a řazení */}
          <MediaFilterBar
              searchQuery={searchQuery}
              typeFilter={typeFilter}
              sortBy={sortBy}
              onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
              onTypeFilterChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
              onSortChange={(v) => { setSortBy(v); setCurrentPage(1); }}
          />

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
                              <img src={getStorageUrl(item.path)} alt={item.filename} className="w-full h-full object-cover" />
                          )}
                        </div>
                    );
                  })}
                </div>

                <div className="px-6 pb-6">
                  <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={paginatedMedia.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                  />
                </div>
              </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && (
            <MediaDetailPanel
                item={selectedItem}
                isAudio={isAudio(selectedItem.mime_type)}
                onFullscreen={setFullscreenUrl}
                onDelete={handleDelete}
            />
        )}

        {/* Fullscreen modal */}
        {fullscreenUrl && (
            <MediaFullscreenModal
                url={fullscreenUrl}
                onClose={() => setFullscreenUrl(null)}
            />
        )}
      </div>
  );
}