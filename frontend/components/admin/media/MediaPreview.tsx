import { isAudioPath, getStorageUrl } from '@/lib/api/media'

interface MediaPreviewProps {
    path?: any | null
    alt?: string
    className?: string
}

export default function MediaPreview({ path, alt = '', className = '' }: MediaPreviewProps) {
    if (!path) return null

    if (isAudioPath(path)) {
        return (
            <audio
                controls
                src={getStorageUrl(path)}
                className={`w-full h-9 ${className}`}
            />
        )
    }

    return (
        <img
            src={getStorageUrl(path)}
            alt={alt}
            className={`object-cover ${className}`}
        />
    )
}