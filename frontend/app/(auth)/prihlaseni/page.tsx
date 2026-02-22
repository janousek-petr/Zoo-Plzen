import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";

export default function SignIn(){
    return(
        <>
            <h1 className="cus-auth-title">Přihlášení</h1>
            
            <SignInForm/>

            <p className="text-center">
                Nemáte účet?<br/>
                Registrovat se <Link href="/registrace" className="underline text-green-700">zde</Link>.
            </p>
        </>
    )
}