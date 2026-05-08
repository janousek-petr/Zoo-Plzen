import axios from '@/lib/axios'
import { MediaItem } from '@/lib/types'

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