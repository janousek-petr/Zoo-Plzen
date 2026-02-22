"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpForm(){

    const { register, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');

    const formData = {
        first_name : firstName,
        last_name : lastName,
        email : email,
        password : password,
        password_confirmation : passwordAgain
    }

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        await register(formData)
    }
    

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-self-center gap-4">

                    <label htmlFor="email" className="font-bold">Email</label>
                    <input type="email" id="email" className="cus-auth-input" onChange={(e) => setEmail(e.target.value)} required />

                    <div className="grid md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="font-bold">Jméno</label>
                            <input type="text" id="firstName" className="cus-auth-input" onChange={(e) => setFirstName(e.target.value)} required/>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="font-bold">Příjmení</label>
                            <input type="text" id="lastName" className="cus-auth-input" onChange={(e) => setLastName(e.target.value)} required/>
                        </div>

                    </div>

                    <label htmlFor="password" className="font-bold">Heslo</label>
                    <input type="password" id="password" className="cus-auth-input" onChange={(e) => setPassword(e.target.value)} required/>

                    <label htmlFor="passwordCheck" className="font-bold">Heslo znovu</label>
                    <input type="password" id="passwordCheck" className="cus-auth-input" onChange={(e) => setPasswordAgain(e.target.value)} required/>

                    <button className="cus-auth-submit disabled:opacity-50" type="submit" disabled={isLoading}>
                        {isLoading ? "Registruji..." : "Registrovat"}
                    </button>
                </div>
            </form>
        </>
    )
}