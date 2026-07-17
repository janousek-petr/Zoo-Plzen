"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RiAlertLine } from "react-icons/ri";

export default function SignInForm() {
    const { login, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ email, password });
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

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="font-bold">Heslo</label>
                    <input
                        type="password"
                        id="password"
                        className="cus-auth-input"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div
                        role="alert"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 break-words"
                    >
                        <RiAlertLine className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    className="cus-auth-submit disabled:opacity-50"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Přihlašuji..." : "Přihlásit"}
                </button>
            </div>
        </form>
    );
}