"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { RiAlertLine, RiCheckLine, RiInformationLine, RiMailSendLine } from "react-icons/ri";
import useAuth from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { resendVerificationEmail} = useAuth();
    const { isVerified, user, isLoading } = useAuthContext();

    const verify = searchParams.get("verify") === "true";
    const hasRefSent = useRef(false);

    // Stavy pro časovač a odesílání
    const [timeLeft, setTimeLeft] = useState(0);
    const [sending, setSending] = useState(false);
    const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");

    // Odpočet sekund pro časovač
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Kontrola přihlášení a ověření
    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace("/prihlaseni");
            return;
        }

        if (isVerified) {
            router.replace("/zvoleni-profilu");
            return;
        }
    }, [user, isVerified, isLoading, router]);

    // Funkce pro opetovné zaslání e-mailu
    const handleResend = async () => {
        if (timeLeft > 0 || sending) return;

        setSending(true);
        setResendStatus("idle");

        try {
            await resendVerificationEmail();
            setResendStatus("success");
            setTimeLeft(60); // Spustí 60sekundový časovač
        } catch (err) {
            setResendStatus("error");
        } finally {
            setSending(false);
        }
    };

    // Automatické zaslání e-mailu po přihlášení (?autoSend=true)
    useEffect(() => {
        if (isLoading || !user || isVerified) return;

        const shouldAutoSend = sessionStorage.getItem("pendingEmailResend") === "true";

        if (shouldAutoSend && !hasRefSent.current) {
            hasRefSent.current = true;
            // Okamžitě klíč smaže, aby se při dalším F5 e-mail znovu neposílal
            sessionStorage.removeItem("pendingEmailResend");
            handleResend().then(r => setResendStatus("idle"));
        }
    }, [user, isVerified, isLoading, handleResend]);

    if (isLoading || !user || isVerified) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-500 uppercase cus-font-impacted">Načítám...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:my-30 my-20">
            <h1 className="cus-auth-title">Ověření e-mailu</h1>

            {/* Informační box o zaslaném e-mailu */}
            {!searchParams.has("verify") && (
                <div className="w-full max-w-sm mx-auto">
                    <div
                        role="contentinfo"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-grey-50 border border-grey-200 text-grey-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                    >
                        <RiInformationLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>
                            Pro přístup do aplikace musíme ověřit Vaší e-mailovou adresu <b>{user.email}</b>. Zaslali jsme Vám na e-mailovou adresu odkaz na ověření e-mailu. Prosím, otevřete tento odkaz pro přístup k aplikaci do 60 minut.
                        </span>
                    </div>
                </div>
            )}

            {/* Výsledkový stav podle URL parametru verify */}
            {searchParams.has("verify") && (
                !verify ? (
                    <div className="w-full max-w-sm mx-auto">
                        <div
                            role="alert"
                            aria-live="polite"
                            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                        >
                            <RiAlertLine className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Něco se nepovedlo. Zkuste odkaz otevřít znovu nebo si nechte poslat nový.</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full max-w-sm mx-auto">
                            <div
                                role="alert"
                                aria-live="polite"
                                className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                            >
                                <RiCheckLine className="w-4 h-4 mt-0.5 shrink-0"/>
                                <span>
                                    Ověření e-mailu bylo úspěšné. Nyní můžete přejít do aplikace
                                    <Link href={"/zvoleni-profilu"} className="underline text-green-700"> zde</Link>
                                </span>

                            </div>
                        </div>
                        <p className="text-center">
                            Zpět do aplikace<br/>
                            <Link href="/zvoleni-profilu" className="underline text-green-700">zde</Link>.
                        </p>
                    </>
                )
            )}

            {/* Zpětná vazba po stisknutí tlačítka Znovu odeslat */}
            {resendStatus === "success" && (
                <div className="w-full max-w-sm mx-auto">
                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2">
                        <RiCheckLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>Nový ověřovací e-mail byl úspěšně odeslán.</span>
                    </div>
                </div>
            )}

            {resendStatus === "error" && (
                <div className="w-full max-w-sm mx-auto">
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                        <RiAlertLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>Nepodařilo se znovu odeslat e-mail. Zkuste to za chvíli.</span>
                    </div>
                </div>
            )}

            {/* Tlačítko s časovačem */}
            {!verify && (
                <div className="w-full max-w-sm mx-auto text-center pt-2">
                    <p className="text-sm text-gray-600 mb-2">
                        Nedorazil Vám e-mail? Zkontrolujte složku Spam nebo pošlete nový.
                    </p>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={timeLeft > 0 || sending || verify}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium w-full"
                    >
                        <RiMailSendLine className="w-4 h-4" />
                        {sending
                            ? "Odesílám..."
                            : timeLeft > 0
                                ? `Znovu odeslat za ${timeLeft}s`
                                : "Znovu odeslat e-mail"}
                    </button>
                </div>
            )}
        </div>
    );
}