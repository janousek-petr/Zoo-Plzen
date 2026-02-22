"use client"

export default function SignInForm(){
    return(
        <>
            <form>
                <div className="flex flex-col justify-self-center gap-4">

                    <label htmlFor="email" className="font-bold">Email</label>
                    <input type="email" id="email" className="cus-auth-input" required/>

                    <label htmlFor="" className="font-bold">Heslo</label>
                    <input type="password" id="password" className="cus-auth-input"/>

                    <button className="cus-auth-submit">
                        Přihlásit
                    </button>
                </div>
            </form>
        </>
    )
}