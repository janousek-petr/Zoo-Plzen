import axios from '@/lib/axios'
import { MediaItem } from '@/lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getStorageUrl(path?: any): string {
    if (!path) return '';

    // Získání řetězce cesty z různorodých datových typů (string vs object)
    let stringPath: string | null = null;

    if (typeof path === 'string') {
        stringPath = path;
    } else if (typeof path === 'object') {
        stringPath = path.path || path.image?.path || path.audio?.path || path.url || null;
    }

    if (!stringPath || typeof stringPath !== 'string') {
        return '';
    }

    // Pokud cesta již obsahuje celou URL (http/https), vrátíme ji rovnou
    if (stringPath.startsWith('http://') || stringPath.startsWith('https://')) {
        return stringPath;
    }

    // Ošetření lomítek mezi API_URL a path
    const cleanPath = stringPath.startsWith('/') ? stringPath : `/${stringPath}`;
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

export function isAudioPath(path?: any): boolean {
    if (!path) return false;

    // Získání řetězce cesty z různorodých datových typů (string vs object)
    let stringPath: string | null = null;

    if (typeof path === 'string') {
        stringPath = path;
    } else if (typeof path === 'object') {
        stringPath = path.path || path.audio?.path || null;
    }

    if (!stringPath || typeof stringPath !== 'string') {
        return false;
    }

    const ext = stringPath.split('.').pop()?.toLowerCase();
    return !!ext && AUDIO_EXTENSIONS.includes(ext);
}