"use client";
import Link from "next/link";
import ForgottenPasswordForm from "@/components/auth/ForgottenPasswordForm";

export default function ForgottenPassword() {
    return (
        <>

            <h1 className="cus-auth-title">Zapomenuté heslo</h1>
            <p className="w-full max-w-sm mx-auto">Pro obnovení hesla zadejte Váš e-mail k účtu.</p>
            <ForgottenPasswordForm/>

            <p className="text-center">
                Zpět na přihlašovácí stránku<br/>
                <Link href="/prihlaseni" className="underline text-green-700">zde</Link>.
            </p>

        </>
    );
}