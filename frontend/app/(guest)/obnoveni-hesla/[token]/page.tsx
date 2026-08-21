"use client";
import { useSearchParams, useParams} from "next/navigation";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import {useEffect, useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {FiAlertCircle} from "react-icons/fi";

export default function ResetPasswordPage() {
// Načtení tokenu z cesty URL (/obnoveni-hesla/XYZ123TOKEN)
    const params = useParams();
    const token = params.token as string;

    // Načtení e-mailu z URL parametrů (?email=jan@example.com)
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [isValid, setIsValid] = useState(false);
    const { isLoading, checkResetToken, error } = useAuth()

    useEffect(() => {
        if (email && token)
            console.log(email, token);

        const verifyToken = async () => {
            try {
                await checkResetToken(email, token);
                setIsValid(true);
            } catch (err: any) {
                setIsValid(false);
            }
        }
        verifyToken();
    }, [token, email, checkResetToken]);

    if (isLoading) {
        return (
            <>
                <h1 className="cus-auth-title">Obnovení hesla</h1>
                <p className="text-center">Načítávám potřebná data...</p><br/>
                <p className="text-center">
                    Zpět na přihlašovácí stránku<br/>
                    <Link href="/prihlaseni" className="underline text-green-700 ">zde</Link>.
                </p>
            </>
        )
    }

    return (
        <>
            <h1 className="cus-auth-title">Obnovení hesla</h1>
            {isValid ? (
                <><p className="w-full max-w-sm mx-auto">Zadejte nové heslo pro Váš účet.</p>
                    <ResetPasswordForm email={email} token={token}/>
                </>
            ): (
                <div className="w-full max-w-sm mx-auto">
                    <div
                        role="alert"
                        aria-live="polite"
                        className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 wrap-break-word"
                    >
                        <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                </div>
            )
            }
            <p className="text-center">
                Zpět na přihlašovácí stránku<br/>
                <Link href="/prihlaseni" className="underline text-green-700 ">zde</Link>.
            </p>

        </>

    );
}