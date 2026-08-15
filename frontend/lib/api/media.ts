import axios from '@/lib/axios'
import { MediaItem } from '@/lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getStorageUrl(path?: string | null): string {
    if (!path) return '';
    // Pokud cesta již obsahuje celou URL (http/https), vrátíme ji rovnou
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Ošetření lomítek mezi API_URL a path
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
}

export async function getMedia(): Promise<MediaItem[]> {
    try {
        const res = await axios.get('/api/media');
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function uploadMedia(file: File): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}

export async function deleteMedia(id: number): Promise<void> {
    await axios.delete(`/api/media/${id}`);
}

const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'webm'];

export function isAudioPath(path?: string | null): boolean {
    if (!path) return false;
    const ext = path.split('.').pop()?.toLowerCase();
    return !!ext && AUDIO_EXTENSIONS.includes(ext);
}