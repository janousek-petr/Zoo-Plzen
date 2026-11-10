"use client";

import { useState, useEffect, useRef, ClipboardEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
    RiAlertLine,
    RiCheckLine,
    RiInformationLine,
    RiMailSendLine,
    RiLogoutBoxRLine,
    RiShieldCheckLine
} from "react-icons/ri";
import useAuth from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
    const router = useRouter();

    const { resendVerificationEmail, logout, checkVerificationCode } = useAuth();
    const { isVerified, user, isLoading, refreshUser } = useAuthContext();

    const hasRefSent = useRef(false);

    // Stavy pro 6místný kód
    const CODE_LENGTH = 6;
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Stavy pro odpočet, odesílání a chybové/úspěšné hlášky
    const [timeLeft, setTimeLeft] = useState(0);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
    const [verifyStatus, setVerifyStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // Odpočet sekund pro časovač
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Odeslání 6místného kódu na backend
    const submitVerificationCode = async (fullCode: string) => {
        if (verifying || fullCode.length !== CODE_LENGTH) return;

        setVerifying(true);
        setVerifyStatus("idle");
        setErrorMessage("");

        try {
            await checkVerificationCode(fullCode);
            setVerifyStatus("success");
            await refreshUser();
            setTimeout(() => {
                router.replace("/zvoleni-profilu");
            }, 1500);

        } catch (err: any) {
            setVerifyStatus("error");
            setErrorMessage(err.response?.data?.message || "Zadaný kód je neplatný nebo vypršela jeho platnost.");
        } finally {
            setVerifying(false);
        }
    };

    // Změna v jednotlivých políčkách
    const handleInputChange = (index: number, value: string) => {
        // Povolit pouze číslice
        const cleanValue = value.replace(/\D/g, "");

        if (!cleanValue) {
            const newCode = [...code];
            newCode[index] = "";
            setCode(newCode);
            return;
        }

        const digit = cleanValue.slice(-1);
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        // Posun na další políčko
        if (index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Pokud je vyplněno všech 6 číslic, automaticky odeslat
        const finalCode = newCode.join("");
        if (finalCode.length === CODE_LENGTH) {
            submitVerificationCode(finalCode);
        }
    };

    // Obsluha klávesy Backspace
    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Obsluha vložení kódu ze schránky (Paste)
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);

        if (!pastedData) return;

        const newCode = Array(CODE_LENGTH).fill("");
        pastedData.split("").forEach((char, index) => {
            newCode[index] = char;
        });
        setCode(newCode);

        // Zaostřit na políčko za poslední vloženou číslicí
        const nextFocusIndex = Math.min(pastedData.length, CODE_LENGTH - 1);
        inputRefs.current[nextFocusIndex]?.focus();

        if (pastedData.length === CODE_LENGTH) {
            submitVerificationCode(pastedData);
        }
    };

    // Opětovné odeslání e-mailu s kódem
    const handleResend = async () => {
        if (timeLeft > 0 || sending) return;

        setSending(true);
        setResendStatus("idle");

        try {
            await resendVerificationEmail();
            setResendStatus("success");
            setTimeLeft(60);
        } catch {
            setResendStatus("error");
        } finally {
            setSending(false);
        }
    };

    // Automatické odeslání kódového e-mailu po registraci/přihlášení
    useEffect(() => {
        if (isLoading || !user || isVerified) return;

        const shouldAutoSend = sessionStorage.getItem("pendingEmailResend") === "true";

        if (shouldAutoSend && !hasRefSent.current) {
            hasRefSent.current = true;
            sessionStorage.removeItem("pendingEmailResend");
            handleResend().then(() => setResendStatus("idle"));
        }
    }, [user, isVerified, isLoading, handleResend]);

    const handleLogout = async () => {
        await logout();
        router.replace("/prihlaseni");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:my-30 my-20">
            <h1 className="cus-auth-title">Ověření e-mailu</h1>

            {/* Informační box o zaslání kódu */}
            <div className="w-full max-w-sm mx-auto">
                <div
                    role="contentinfo"
                    aria-live="polite"
                    className="flex items-start gap-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                >
                    <RiInformationLine className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
                    <span>
                        Pro přístup do aplikace musíte ověřit e-mail <b>{user?.email}</b>. Zaslali jsme Vám 6místný ověřovací kód. Platnost kódu je 15 minut.
                    </span>
                </div>
            </div>

            {/* FORMULÁŘ PRO 6 OB DÉLNÍKŮ / ČÍSLIC */}
            <div className="w-full max-w-sm mx-auto space-y-4">
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => submitVerificationCode(code.join(""))}
                    disabled={verifying || code.join("").length !== CODE_LENGTH}
                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium w-full shadow-sm"
                >
                    <RiShieldCheckLine className="w-5 h-5" />
                    {verifying ? "Ověřuji..." : "Ověřit kód"}
                </button>
            </div>

            {/* Zpětná vazba po ověření */}
            {verifyStatus === "success" && (
                <div className="w-full max-w-sm mx-auto">
                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2">
                        <RiCheckLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>Kód byl úspěšně ověřen! Přesměrovávám...</span>
                    </div>
                </div>
            )}

            {verifyStatus === "error" && (
                <div className="w-full max-w-sm mx-auto">
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                        <RiAlertLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}

            {/* Zpětná vazba po stisknutí tlačítka Znovu odeslat */}
            {resendStatus === "success" && (
                <div className="w-full max-w-sm mx-auto">
                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2">
                        <RiCheckLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>Nový ověřovací kód byl úspěšně odeslán na Váš e-mail.</span>
                    </div>
                </div>
            )}

            {resendStatus === "error" && (
                <div className="w-full max-w-sm mx-auto">
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                        <RiAlertLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>Nepodařilo se znovu odeslat kód. Zkuste to za chvíli.</span>
                    </div>
                </div>
            )}

            {/* Sekce pro opětovné odeslání kódu a odhlášení */}
            <div className="w-full max-w-sm mx-auto text-center pt-2 space-y-4">
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                        Nedorazil Vám kód? Zkontrolujte složku Spam nebo si nechte poslat nový.
                    </p>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={timeLeft > 0 || sending}
                        className="inline-flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium w-full"
                    >
                        <RiMailSendLine className="w-4 h-4" />
                        {sending
                            ? "Odesílám..."
                            : timeLeft > 0
                                ? `Znovu odeslat za ${timeLeft}s`
                                : "Poslat nový kód"}
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="space-y-1 text-center">
                        <p className="font-bold text-gray-800 text-sm">
                            Zadal/a jste špatný e-mail?
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Odhlaste se z tohoto účtu a vytvořte si novou registraci se správnou adresou.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium w-full"
                    >
                        <RiLogoutBoxRLine className="w-4 h-4" />
                        Odhlásit se
                    </button>

                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2.5 text-center text-xs">
                        <p className="font-semibold text-gray-800">
                            Přihlášen jako: {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-gray-500 break-all">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}