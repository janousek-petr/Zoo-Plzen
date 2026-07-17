"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import { passwordRules, isPasswordValid } from "@/lib/api/auth";

export default function SignUpForm() {
    const { register, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [touched, setTouched] = useState(false);
    const [passwordAgainTouched, setPasswordAgainTouched] = useState(false);

    const passwordsMatch = password.length > 0 && password === passwordAgain;
    const passwordOk = isPasswordValid(password);
    const canSubmit = passwordOk && passwordsMatch;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);

        if (!canSubmit) return;

        await register({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            password_confirmation: passwordAgain,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
            <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-bold">Email</label>
                    <input type="email" id="email" className="cus-auth-input" onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="firstName" className="font-bold">Jméno</label>
                        <input type="text" id="firstName" className="cus-auth-input" onChange={(e) => setFirstName(e.target.value)} required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="lastName" className="font-bold">Příjmení</label>
                        <input type="text" id="lastName" className="cus-auth-input" onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="font-bold">Heslo</label>
                    <input
                        type="password"
                        id="password"
                        className="cus-auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Checklist požadavků na heslo — zobrazí se, jakmile uživatel začne psát */}
                {password.length > 0 && (
                    <ul className="flex flex-col gap-1 text-sm -mt-2">
                        {passwordRules.map((rule) => {
                            const passed = rule.test(password);
                            return (
                                <li
                                    key={rule.label}
                                    className={`flex items-center gap-1.5 ${passed ? "text-green-600" : "text-gray-400"}`}
                                >
                                    {passed ? <FiCheck className="w-3.5 h-3.5 shrink-0" /> : <FiX className="w-3.5 h-3.5 shrink-0" />}
                                    {rule.label}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <div className="flex flex-col gap-1">
                    <label htmlFor="passwordCheck" className="font-bold">Heslo znovu</label>
                    <input
                        type="password"
                        id="passwordCheck"
                        className="cus-auth-input"
                        value={passwordAgain}
                        onChange={(e) => setPasswordAgain(e.target.value)}
                        onBlur={() => setPasswordAgainTouched(true)}
                        required
                    />
                </div>

                {passwordAgainTouched && passwordAgain.length > 0 && !passwordsMatch && (
                    <p className="flex items-center gap-1.5 text-sm text-red-500 -mt-2">
                        <FiX className="w-3.5 h-3.5 shrink-0" />
                        Hesla se neshodují
                    </p>
                )}

                {touched && !canSubmit && !error && (
                    <div
                        role="alert"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 break-words"
                    >
                        <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>Zkontrolujte prosím podmínky hesla výše.</span>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 break-words"
                    >
                        <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button className="cus-auth-submit disabled:opacity-50" type="submit" disabled={isLoading}>
                    {isLoading ? "Registruji..." : "Registrovat"}
                </button>
            </div>
        </form>
    );
}