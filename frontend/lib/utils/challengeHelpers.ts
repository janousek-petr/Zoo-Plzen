import { MediaItem, Region } from "@/lib/types";

export interface Template {
    id: number;
    title: string;
    type: string;
    description: string;
    min_target: number;
    max_target: number;
    reward_paw: number;
    period: "daily" | "weekly" | "both";
}

/**
 * Zjistí, zda výzva vyžaduje výběr regionu podle obsahu proměnné nebo typu.
 */
export function checkRequiresRegion(description: string, selectedTemplate: Template | null): boolean {
    if (description.includes("{region}")) return true;
    if (selectedTemplate?.description?.includes("{region}")) return true;
    if (selectedTemplate?.type?.toLowerCase().includes("region")) return true;
    return false;
}

/**
 * Sestaví payload pro API vytvoření výzvy.
 */
export function buildChallengePayload(params: {
    period: "daily" | "weekly";
    selectedTemplate: Template | null;
    title: string;
    description: string;
    target: number;
    reward: number;
    image: MediaItem | null;
    side: "left" | "right" | "both";
    selectedRegion: Region | null;
    hasRegionRequirement: boolean;
}) {
    const {
        period, selectedTemplate, title, description, target,
        reward, image, side, selectedRegion, hasRegionRequirement
    } = params;

    const validUntil = new Date();
    if (period === "weekly") {
        validUntil.setDate(validUntil.getDate() + 7);
    } else {
        validUntil.setDate(validUntil.getDate() + 1);
    }

    return {
        period,
        challenge_type: selectedTemplate?.type || "custom_challenge",
        code: selectedTemplate ? `TMPL_${selectedTemplate.id}_${Date.now()}` : `CUSTOM_${Date.now()}`,
        title,
        description,
        target,
        reward,
        valid_until: validUntil.toISOString(),
        media_id: image?.id || null,
        animalSrc: image?.path || null,
        animalAlt: title || "Obrázek výzvy",
        animalSide: side,
        bgColor: selectedRegion?.color || "#BD9554",
        region_id: hasRegionRequirement ? (selectedRegion?.id || null) : null,
    };
}