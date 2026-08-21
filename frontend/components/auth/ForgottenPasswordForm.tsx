import {FiAlertCircle} from "react-icons/fi";
import {useAuth} from "@/hooks/useAuth";
import {useEffect, useState} from "react";

export default function ForgottenPasswordForm() {
    const { isLoading, error, forgotPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    // Efekt pro postupný odpočet každou sekundu
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);
        try {
            await forgotPassword(email);
            setStatusMessage("Odkaz jsme poslali na Vaší e-mailovou adresu. Doručení může trvat 1–2 minuty. Zkontrolujte prosím i složku SPAM.");
            // Nastavení 60sekundového odpočtu po úspěšném odeslání
            setCooldown(60);
        } catch (err) {

        }

    };
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-bold">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="cus-auth-input"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div
                        role="alert"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                    >
                        <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {statusMessage && (
                    <div
                        role="success"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                    >
                        <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0"/>
                        <span>{statusMessage}</span>
                    </div>
                )}

                <button
                    className="cus-auth-submit disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading || cooldown > 0}
                >
                    {isLoading
                        ? "Čekejte, prosím..."
                        : cooldown > 0
                            ? `Znovu odeslat za ${cooldown}s`
                            : "Obnovit heslo"
                    }
                </button>
            </div>
        </form>
    )
}