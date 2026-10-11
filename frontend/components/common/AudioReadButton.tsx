"use client";

import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

interface Props {
    text: string;
    color?: string;
    size?: number;
}

export default function AudioReadButton({ text, color, size = 20 }: Props) {
    const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

    if (!isSupported || !text) return null;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                isSpeaking ? stop() : speak(text);
            }}
            className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center text-white shadow-md active:scale-95 flex-shrink-0 cursor-pointer ${
                isSpeaking ? "ring-4 ring-amber-300 animate-pulse" : ""
            }`}
            style={{ backgroundColor: color || "#5aab6e" }}
            title={isSpeaking ? "Zastavit čtení" : "Přečíst text"}
            aria-label={isSpeaking ? "Zastavit čtení" : "Přečíst text"}
        >
            {isSpeaking ? <FiVolumeX size={size} /> : <FiVolume2 size={size} />}
        </button>
    );
}