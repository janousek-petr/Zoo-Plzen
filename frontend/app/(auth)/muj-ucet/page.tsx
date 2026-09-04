"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import userService from "@/lib/api/users";
import { useRouter } from "next/navigation";
import {
    RiPencilLine,
    RiDeleteBinLine,
    RiArrowLeftLine,
    RiSaveLine,
    RiCloseLine, RiAlertLine,
} from "react-icons/ri";

export default function MyAccountPage() {
    const { user, clearLocalAuth} = useAuthContext();
    const router = useRouter();
    const date = new Date(user?.created_at)

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    // Synchronizace dat uživatele do formuláře
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleCancel = () => {
        // Vrátí původní hodnoty ze stávajícího uživatele
        setFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
        });
        setIsEditing(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            userService.update(user?.id, formData)
            setIsEditing(false);
        } catch (error) {
            console.log("Chyba v úpravě údajů: ", error);
            setError("Nepodařilo se uložit nové údaje. Zkuste to prosím později.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async () => {
        if (confirm("Opravdu chcete smazat svůj účet? Smažou se všechny profily vytvořené na Vašem účtu. Tato akce je nevratná!")) {
            try {
                setLoading(true);
                setError(null);
                userService.destroy(user?.id)
                clearLocalAuth()
                router.push("/prihlaseni");
            } catch (error) {
                console.error("Nepodařilo se smazat účet:", error);
                setError("Nepodařilo se smazat účet. Zkuste to prosím později.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="py-20 flex flex-col justify-center items-center gap-4">
            {error && (<div className="w-full max-w-md">
                <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                >
                    <RiAlertLine className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            </div>
            )}

            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                {/* Hlavička */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Můj účet</h1>
                    <button
                        type="button"
                        onClick={() => router.push("/zvoleni-profilu")}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <RiArrowLeftLine size={16} />
                        Zpět
                    </button>
                </div>

                {/* Formulář osobnich udaju */}
                <form onSubmit={handleSave}>
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Osobní údaje</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="first_name" className="text-sm font-bold text-gray-700">
                                    Jméno
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className={`border-2 rounded-lg px-4 py-2.5 text-gray-800 font-medium outline-none transition-colors ${
                                        isEditing
                                            ? "border-sky-500 bg-white focus:ring-2 focus:ring-sky-200"
                                            : "border-gray-200 bg-gray-50 cursor-not-allowed"
                                    }`}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="last_name" className="text-sm font-bold text-gray-700">
                                    Příjmení
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className={`border-2 rounded-lg px-4 py-2.5 text-gray-800 font-medium outline-none transition-colors ${
                                        isEditing
                                            ? "border-sky-500 bg-white focus:ring-2 focus:ring-sky-200"
                                            : "border-gray-200 bg-gray-50 cursor-not-allowed"
                                    }`}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="text-sm font-bold text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className={`border-2 rounded-lg px-4 py-2.5 text-gray-800 font-medium outline-none transition-colors ${
                                        isEditing
                                            ? "border-sky-500 bg-white focus:ring-2 focus:ring-sky-200"
                                            : "border-gray-200 bg-gray-50 cursor-not-allowed"
                                    }`}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">

                                <p className={"text-sm font-bold text-gray-700"}>Datum vytvoření účtu: {date.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tlačítka akcí */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <RiCloseLine size={18} />
                                    Zrušit
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <RiSaveLine size={18} />
                                    {loading ? "Ukládám..." : "Uložit změny"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <RiPencilLine size={18} />
                                    Upravit údaje
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <RiDeleteBinLine size={18} />
                                    Smazat účet
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}