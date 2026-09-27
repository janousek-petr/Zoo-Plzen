"use client";

import Image from "next/image";
import { generatePalette } from "@/components/area/ColorPaletteGenerator";
import { getStorageUrl } from "@/lib/api/media";

export interface WeeklyChallengeData {
    id?: number;
    title: string;
    description: string;
    progress?: number;
    target: number;
    reward: number;
    animalSrc?: string | null;
    animalAlt?: string;
    animalSide?: "left" | "right";
    bgColor?: string;
    completed?: boolean;
    regionName?: string;
}

const DEFAULT_IMAGE = "/img/photo-no-bg/lion.png";
const DEFAULT_BG = "#BD9554";

interface Props {
    challenge: WeeklyChallengeData;
    variant?: "admin" | "public";
}

export default function WeeklyChallengeBlock({ challenge, variant = "admin" }: Props) {
    const isRight = challenge.animalSide !== "left";
    const isHexColor = challenge.bgColor?.startsWith("#");

    const palette = isHexColor ? generatePalette(challenge.bgColor!) : generatePalette(DEFAULT_BG);
    const finalAnimalSrc = challenge.animalSrc || DEFAULT_IMAGE;

    const targetValue = challenge.target || 1;
    const currentProgress = challenge.progress ?? 0;
    const progressPercent = Math.min((currentProgress / targetValue) * 100, 100);

    // Formatování popisu (nahrazení proměnných)
    const formattedDescription = (challenge.description || "")
        .replace("{count}", String(challenge.target || 0))
        .replace("{region}", challenge.regionName || "Afrických");

    const isPublic = variant === "public";

    return (
        <div
            className={`relative w-full flex items-center px-5 sm:px-16 md:px-24 ${
                isPublic ? "rounded-none overflow-visible" : "rounded-2xl overflow-hidden"
            } ${isRight ? "justify-start" : "justify-end"}`}
            style={{
                height: "280px",
                backgroundColor: palette?.secondary || "#F4EAD4",
            }}
        >
            {/* Obrázek zvířete s přesahu na veřejném webu */}
            <Image
                src={getStorageUrl(finalAnimalSrc)}
                alt={challenge.animalAlt || "Zvíře"}
                className={`absolute bottom-0 w-auto object-bottom z-0 select-none pointer-events-none ${
                    isRight ? "right-0" : "left-0"
                }`}
                style={{
                    height: isPublic ? "150%" : "140%",
                    maxWidth: "none",
                }}
                draggable={false}
                width={600}
                height={600}
                priority
            />

            {/* Textový obsah */}
            <div
                className="relative z-10 max-w-[55%] sm:max-w-sm"
                style={{ color: palette?.accent || "#7a4a1e" }}
            >
                <h2 className="cus-font-impacted-2 uppercase text-4xl sm:text-5xl md:text-6xl leading-tight">
                    {challenge.title || "NÁZEV VÝZVY"}
                </h2>

                <p className="text-base sm:text-lg mt-1 leading-snug">
                    {formattedDescription}
                </p>

                {/* Progress Bar */}
                <div className="mt-3 w-full max-w-55">
                    <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercent}%`,
                                backgroundColor: palette?.primary || "#BD9554",
                            }}
                        />
                    </div>
                </div>

                {/* Odměna */}
                <div className="flex items-center gap-2 mt-3">
                    <span className="relative w-12 h-12 shrink-0 block">
                        <Image
                            src="/img/icons/currency-icon.png"
                            alt="Tlapky"
                            fill
                            className="object-contain"
                        />
                    </span>
                    <span className="cus-font-impacted-2 text-4xl">
                        {challenge.reward} {challenge.completed && "✅"}
                    </span>
                </div>
            </div>
        </div>
    );
}