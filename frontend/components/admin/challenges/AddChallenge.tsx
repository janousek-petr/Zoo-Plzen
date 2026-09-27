"use client";

import { useState, useEffect, useMemo } from "react";
import MediaPickerButton from "@/components/admin/media/MediaPickerButton";
import ChallengePreview from "@/components/admin/challenges/ChallengePreview";
import { MediaItem, type Region } from "@/lib/types";
import { getRegions } from "@/lib/api/quizzes";
import { createChallenge, getTemplates } from "@/lib/api/challenges";
import { Template, checkRequiresRegion, buildChallengePayload } from "@/lib/utils/challengeHelpers";

export default function AddChallenge() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [target, setTarget] = useState<number>(5);
    const [reward, setReward] = useState<number>(10);
    const [period, setPeriod] = useState<"daily" | "weekly">("weekly");
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [image, setImage] = useState<MediaItem | null>(null);
    const [side, setSide] = useState<"left" | "right" | "both">("right");

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        getRegions().then(setRegions);
        getTemplates().then(setTemplates);
    }, []);

    const hasRegionRequirement = useMemo(
        () => checkRequiresRegion(description, selectedTemplate),
        [description, selectedTemplate]
    );

    useEffect(() => {
        if (!hasRegionRequirement) setSelectedRegion(null);
    }, [hasRegionRequirement]);

    const filteredTemplates = useMemo(
        () => templates.filter((t) => t.period === period || t.period === "both"),
        [templates, period]
    );

    const handlePeriodChange = (newPeriod: "daily" | "weekly") => {
        setPeriod(newPeriod);
        if (selectedTemplate && selectedTemplate.period !== "both" && selectedTemplate.period !== newPeriod) {
            setSelectedTemplate(null);
            setTitle("");
            setDescription("");
        }
    };

    const handleSelectTemplate = (templateId: string) => {
        const tmpl = templates.find((t) => String(t.id) === templateId);
        if (!tmpl) {
            setSelectedTemplate(null);
            return;
        }
        setSelectedTemplate(tmpl);
        setTitle(tmpl.title);
        setDescription(tmpl.description);
        setTarget(tmpl.min_target);
        setReward(tmpl.reward_paw);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const payload = buildChallengePayload({
            period, selectedTemplate, title, description,
            target, reward, image, side, selectedRegion, hasRegionRequirement
        });

        try {
            await createChallenge(payload);
            setFeedback({ type: "success", text: "Aktivní výzva byla úspěšně publikována!" });
            setTitle("");
            setDescription("");
            setImage(null);
            setSelectedTemplate(null);
            setSelectedRegion(null);
        } catch (error: any) {
            console.error("Chyba při ukládání výzvy:", error);
            setFeedback({
                type: "error",
                text: error.response?.data?.message || "Nepodařilo se publikovat výzvu.",
            });
        } finally {
            setLoading(false);
        }
    };

    const previewDescription = description
        .replace("{count}", String(target))
        .replace("{region}", selectedRegion?.name || "Afrických");

    return (
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* FORMULÁŘ */}
            <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white p-6 border border-gray-200 rounded-2xl flex flex-col gap-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Vytvořit aktivní výzvy</h1>

                {feedback && (
                    <div className={`p-4 rounded-xl text-sm font-semibold ${
                        feedback.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
                    }`}>
                        {feedback.text}
                    </div>
                )}

                {/* 1. Období */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Určeno pro období</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: "weekly", label: "Týdenní výzva" },
                            { id: "daily", label: "Denní úkol" },
                        ].map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => handlePeriodChange(p.id as "daily" | "weekly")}
                                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                                    period === p.id ? "bg-green-700 text-white border-green-700 shadow-md" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Šablony */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Vybrat typ výzvy (Šablonu)</label>
                    <select
                        onChange={(e) => handleSelectTemplate(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                        value={selectedTemplate?.id || ""}
                    >
                        <option value="">-- Vyberte typ výzvy --</option>
                        {filteredTemplates.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.description ? t.description.replace("{count}", "X") : t.title || t.type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Název a Popis */}
                <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Název výzvy</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="např. LVÍ JÁMA"
                            className="w-full border border-gray-300 rounded-xl p-3 bg-white font-semibold"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-gray-700">Popis výzvy</label>
                            <span className="text-xs text-gray-400 font-mono">Proměnné: {"{count}"}, {"{region}"}</span>
                        </div>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            placeholder='např. Odpověz správně na {count} otázek'
                            className="w-full border border-gray-300 rounded-xl p-3 bg-white resize-none"
                        />
                    </div>
                </div>

                {/* 4. Cíl a Odměna */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Přesný cíl (počet)</label>
                        <input
                            type="number"
                            min={1}
                            required
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-xl p-3 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Odměna (Tlapky)</label>
                        <input
                            type="number"
                            min={1}
                            required
                            value={reward}
                            onChange={(e) => setReward(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-xl p-3 font-bold text-amber-600"
                        />
                    </div>
                </div>

                {/* 5. Region */}
                <div>
                    <label className={`text-sm font-semibold block mb-1 ${!hasRegionRequirement ? "text-gray-400" : "text-gray-700"}`}>
                        Region {!hasRegionRequirement && "(Pro tuto výzvu není vyžadován)"}
                    </label>
                    <select
                        disabled={!hasRegionRequirement}
                        onChange={(e) => setSelectedRegion(regions.find((r) => String(r.id) === e.target.value) || null)}
                        className="w-full border border-gray-300 rounded-xl p-3 bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        value={selectedRegion?.id || ""}
                    >
                        <option value="">-- Vyberte region --</option>
                        {regions.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                {/* 6. Pozice obrázku */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Pozice obrázku zvířete</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: "left", label: "Vlevo" },
                            { id: "right", label: "Vpravo" },
                            { id: "both", label: "Libovolná" },
                        ].map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setSide(s.id as any)}
                                className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                                    side === s.id ? "bg-green-700 text-white border-green-700 shadow-sm" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 7. Obrázek */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Specifický obrázek (volitelný)</label>
                    <MediaPickerButton value={image} onChange={setImage} label="Vybrat obrázek" context={"challenge"}/>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-2 transition-all shadow-md"
                >
                    {loading ? "Publikuji výzvu..." : "Publikovat výzvu"}
                </button>
            </form>

            {/* ŽIVÝ NÁHLED */}
            <ChallengePreview
                period={period}
                title={title}
                description={previewDescription}
                target={target}
                reward={reward}
                previewImageUrl={image?.path}
                previewSide={side === "both" ? "right" : side}
                selectedRegionColor={selectedRegion?.color}
            />
        </div>
    );
}