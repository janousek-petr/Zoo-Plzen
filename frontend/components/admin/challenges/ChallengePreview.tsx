import Image from "next/image";
import WeeklyChallengeBlock from "@/components/challenges/WeeklyChallengeBlock";

interface ChallengePreviewProps {
    period: "daily" | "weekly";
    title: string;
    description: string;
    target: number;
    reward: number;
    previewImageUrl?: string;
    previewSide: "left" | "right";
    selectedRegionColor?: string;
}

export default function ChallengePreview({
                                             period,
                                             title,
                                             description,
                                             target,
                                             reward,
                                             previewImageUrl,
                                             previewSide,
                                             selectedRegionColor,
                                         }: ChallengePreviewProps) {
    return (
        <div className="lg:col-span-6 sticky top-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Živý náhled ({period === "weekly" ? "Týdenní výzva" : "Denní úkol"})
            </h2>

            {period === "weekly" ? (
                <WeeklyChallengeBlock
                    challenge={{
                        title: title || "NÁZEV VÝZVY",
                        description,
                        target,
                        reward,
                        animalSrc: previewImageUrl,
                        animalSide: previewSide,
                        bgColor: selectedRegionColor,
                        progress: 0,
                    }}
                    variant={"admin"}
                />
            ) : (
                <div className="flex flex-row gap-2 w-full max-w-xl">
                    <div className="flex flex-row items-center gap-4 flex-1 px-5 py-4 rounded-2xl bg-[#5aab6e]">
                        <span className="cus-font-impacted-2 text-white text-6xl leading-none select-none">
                            1
                        </span>
                        <div className="flex flex-col">
                            <span className="cus-font-impacted-2 text-white uppercase text-xl tracking-widest leading-tight">
                                {title || "DENNÍ ÚKOL"}
                            </span>
                            <span className="text-white text-sm mt-0.5">
                                {description}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#f15a24] flex-shrink-0">
                        <span className="relative w-8 h-8 block">
                            <Image src="/img/icons/currency-icon.png" alt="Tlapky" fill className="object-contain"/>
                        </span>
                        <span className="text-white font-extrabold text-3xl leading-none">{reward}</span>
                    </div>
                </div>
            )}
        </div>
    );
}