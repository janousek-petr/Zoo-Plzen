import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";

export default function SignUp(){
    return(
        <>
            
            <h1 className="cus-auth-title">Registrace</h1>
            
            <SignUpForm/>

            <p className="text-center">
                Máte již účet?<br/>
                Přihlásit se <Link href="/prihlaseni" className="underline text-green-700">zde</Link>.
            </p>
        
        </>
    )
}