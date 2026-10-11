"use client";

import { useState, useEffect, useCallback } from "react";

export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setIsSupported(true);
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!isSupported) return;

        // Zastavíme předchozí čtení, pokud ještě běží
        window.speechSynthesis.cancel();

        // Odstraníme proměnné jako {count} nebo HTML značky, pokud v textu zůstaly
        const cleanText = text.replace(/\{.*?\}/g, "").trim();
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "cs-CZ"; // Nastavení češtiny
        utterance.rate = 0.9;     // Mírně pomalejší tempo pro děti

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSupported]);

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [isSupported]);

    return { speak, stop, isSpeaking, isSupported };
}