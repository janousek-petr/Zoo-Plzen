"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SignInForm() {
    const { login, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-self-center gap-4">

                <label htmlFor="email" className="font-bold">Email</label>
                <input
                    type="email"
                    id="email"
                    className="cus-auth-input"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password" className="font-bold">Heslo</label>
                <input
                    type="password"
                    id="password"
                    className="cus-auth-input"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
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