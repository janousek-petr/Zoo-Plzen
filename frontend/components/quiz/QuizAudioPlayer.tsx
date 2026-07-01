'use client'

import { useEffect, useRef, useState } from 'react'
import { FiPlay, FiPause } from 'react-icons/fi'

interface QuizAudioPlayerProps {
    src: string
    color?: string
    label?: string
}

export default function QuizAudioPlayer({ src, color = '#374151', label = 'Poslechni si zvuk' }: QuizAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setPlaying(false)
        setProgress(0)
    }, [src])

    const toggle = () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing) {
            audio.pause()
        } else {
            audio.play()
        }
    }

    const handleTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio || !audio.duration) return
        setProgress((audio.currentTime / audio.duration) * 100)
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full max-w-sm my-4 shrink-0">
            <audio
                ref={audioRef}
                src={src}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
            />

            <button
                type="button"
                onClick={toggle}
                aria-label={playing ? 'Pozastavit' : 'Přehrát'}
                className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
                style={{ backgroundColor: color }}
            >
                {/* pulzující kruh při přehrávání */}
                {playing && (
                    <span
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ backgroundColor: color }}
                    />
                )}
                <span className="relative text-white">
                    {playing ? <FiPause size={32} /> : <FiPlay size={32} className="ml-1" />}
                </span>
            </button>

            <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">
                {label}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                    className="h-1.5 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>
        </div>
    )
}