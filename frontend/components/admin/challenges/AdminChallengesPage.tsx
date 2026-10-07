'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuCard, MenuCardProps } from "@/components/admin/MenuCard";
import { RiAddFill, RiPencilLine, RiDeleteBinLine, RiRefreshLine } from "react-icons/ri";
import { useChallenges } from "@/hooks/useChallenges";
import { getStorageUrl } from "@/lib/api/media";
import { deleteChallenge, generateChallenges } from "@/lib/api/challenges";

const menuItems: MenuCardProps[] = [
    { label: "Přidat výzvu", icon: RiAddFill, href: "/admin/challenges/create-challenge" },
];

interface GenerateModalConfig {
    isOpen: boolean;
    type: 'daily' | 'weekly';
}

export default function AdminChallengesPage() {
    // Vytáhneme refetch přímo z vaší useChallenges
    const { data, loading, refetch } = useChallenges(undefined);

    // Lokální stav pro okamžité schování po smazání
    const [weeklyChallenges, setWeeklyChallenges] = useState<any[]>([]);
    const [dailyTasks, setDailyTasks] = useState<any[]>([]);

    // Stavy pro modal generování
    const [modalConfig, setModalConfig] = useState<GenerateModalConfig>({ isOpen: false, type: 'weekly' });
    const [count, setCount] = useState<number>(3);
    const [validFrom, setValidFrom] = useState<string>(new Date().toISOString().split('T')[0]);
    const [terminateExisting, setTerminateExisting] = useState<boolean>(true);
    const [generating, setGenerating] = useState<boolean>(false);

    // Při změně dat v useChallenges aktualizujeme lokální stav
    // TODO: odstranit přetypování, až bude useChallenges správně otypovaný
    useEffect(() => {
        const challengesData = data as { weeklyChallenges?: any[]; dailyTasks?: any[] } | null;

        if (challengesData) {
            setWeeklyChallenges(challengesData.weeklyChallenges || []);
            setDailyTasks(challengesData.dailyTasks || []);
        }
    }, [data]);

    // Smazání výzvy
    const handleDelete = async (id: number, type: 'weekly' | 'daily') => {
        if (!confirm("Opravdu chcete smazat tuto výzvu?")) return;

        try {
            await deleteChallenge(id);
            if (type === 'weekly') {
                setWeeklyChallenges((prev) => prev.filter((item) => item.id !== id));
            } else {
                setDailyTasks((prev) => prev.filter((item) => item.id !== id));
            }
        } catch (error) {
            console.error("Chyba při mazání úkolu:", error);
            alert("Nepodařilo se smazat úkol.");
        }
    };

    const openGenerateModal = (type: 'daily' | 'weekly') => {
        setModalConfig({ isOpen: true, type });
        setCount(type === 'daily' ? 3 : 2);
    };

    // Generování nových výzev
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        try {
            await generateChallenges(
                modalConfig.type,
                count,
                validFrom,
                terminateExisting,
            );

            alert(`Nové ${modalConfig.type === 'weekly' ? 'týdenní výzvy' : 'denní úkoly'} byly úspěšně vygenerovány.`);
            setModalConfig({ isOpen: false, type: 'weekly' });

            // ZAVOLÁME REFETCH Z HOOKU PŘÍMO ZDE
            if (refetch) {
                await refetch();
            }
        } catch (error) {
            console.error("Chyba při generování výzev:", error);
            alert("Nepodařilo se vygenerovat výzvy.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-8">
            {/* Horní dlaždice */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {menuItems.map((item) => (
                    <MenuCard key={item.href} {...item} />
                ))}
            </div>

            {loading ? (
                <div className="py-8 text-center text-gray-500 font-bold animate-pulse">
                    Načítám výzvy...
                </div>
            ) : (
                <>
                    {/* Sekce Týdenní Výzvy */}
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <h1 className="text-xl text-gray-600 uppercase cus-font-impacted">
                                Týdenní výzvy
                            </h1>
                            <button
                                onClick={() => openGenerateModal('weekly')}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
                            >
                                <RiRefreshLine className="w-4 h-4" />
                                Vygenerovat nové týdenní výzvy
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {weeklyChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={getStorageUrl(challenge.animalSrc) || "/img/photo-no-bg/lion.png"}
                                                alt={challenge.animalAlt || challenge.title}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>

                                        <div>
                                            <h2 className="font-extrabold text-lg text-gray-800 uppercase">
                                                {challenge.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {challenge.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                                <span>Cíl: {challenge.target}</span>
                                                <span>•</span>
                                                <span>Odměna: {challenge.reward}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={`/admin/challenges/${challenge.id}/edit`}
                                            className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                            title="Upravit"
                                        >
                                            <RiPencilLine className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(challenge.id, 'weekly')}
                                            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                            title="Smazat"
                                        >
                                            <RiDeleteBinLine className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sekce Denní Úkoly */}
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <h2 className="text-xl text-gray-600 uppercase cus-font-impacted">
                                Denní úkoly
                            </h2>
                            <button
                                onClick={() => openGenerateModal('daily')}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
                            >
                                <RiRefreshLine className="w-4 h-4" />
                                Vygenerovat nové denní úkoly
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dailyTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-black text-gray-400 w-8">
                                            #{task.order}
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 uppercase">
                                                {task.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {task.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={`/admin/challenges/${task.id}/edit`}
                                            className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                            title="Upravit"
                                        >
                                            <RiPencilLine className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(task.id, 'daily')}
                                            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                            title="Smazat"
                                        >
                                            <RiDeleteBinLine className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {/* Modal okno pro generování */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-800">
                            Vygenerovat nové {modalConfig.type === 'weekly' ? 'týdenní výzvy' : 'denní úkoly'}
                        </h3>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Počet výzev k vygenerování
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={count}
                                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Platnost od
                                </label>
                                <input
                                    type="date"
                                    value={validFrom}
                                    onChange={(e) => setValidFrom(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="terminateExisting"
                                    checked={terminateExisting}
                                    onChange={(e) => setTerminateExisting(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                />
                                <label htmlFor="terminateExisting" className="text-sm text-gray-700">
                                    Ukončit platnost stávajících aktivních výzev
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors"
                                    disabled={generating}
                                >
                                    Zrušit
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                                    disabled={generating}
                                >
                                    {generating ? "Generuji..." : "Vygenerovat"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}