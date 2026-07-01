import { isAudioPath } from '@/lib/api/media'

interface MediaPreviewProps {
    path?: string | null
    alt?: string
    className?: string
}

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function MediaPreview({ path, alt = '', className = '' }: MediaPreviewProps) {
    if (!path) return null

    if (isAudioPath(path)) {
        return (
            <audio
                controls
                src={`${apiBase}${path}`}
                className={`w-full h-9 ${className}`}
            />
        )
    }

    return (
        <img
            src={`${apiBase}${path}`}
            alt={alt}
            className={`object-cover ${className}`}
        />
    )
}