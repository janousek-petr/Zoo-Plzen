import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService, { RegisterData, LoginData } from '@/services/authService';

export const useAuth = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [user, setUser] = useState(null);

    const register = async (data : RegisterData) =>{
        setIsLoading(true);
        setError(null);

        try{
            console.log("1. Posílám request na backend...");
            await authService.register(data);

            console.log("2. Vytvářím uživatele...");
            const userResponse = await authService.getUser();
            setUser(userResponse.data);

            console.log("3. Přesouvám...");
            router.push('/zvoleni-profilu')
            console.log("4. Dokončeno...");
        }
        catch (error : any){
            console.error("Nastala chyba!!", error)
            setError(error.response?.data?.message);
        }
        finally{
            setIsLoading(false)
        }
    }

    /**
     * Odhlásí přihlášeného uživatele
     */
    const logout = async () => {
        try {
            console.log("Zkouším odhlášení");
            await authService.logout();
            console.log("Odhlášení proběhlo úspěšně")
            router.push('/');
        } catch (err) {
            console.error(err);
        }
    }

    return{
        register,
        logout,
        isLoading,
        error,
        user
    }

}