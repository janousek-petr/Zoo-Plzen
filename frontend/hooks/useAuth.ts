import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService, { RegisterData, LoginData } from '@/lib/api/auth';
import { useAuthContext } from '@/contexts/AuthContext';
import { getFriendlyErrorMessage } from '@/lib/api/auth';

export const useAuth = () => {
    const router = useRouter();
    const { refreshUser, logout: contextLogout, user, isLoading: contextLoading, isAuthenticated } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.register(data);
            await refreshUser();
            router.push('/zvoleni-profilu');
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err, 'Registrace se nezdařila', false));
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.login(data);
            await refreshUser();
            router.push('/zvoleni-profilu');
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err, 'Přihlášení se nezdařilo', true));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await contextLogout();
            router.push('/prihlaseni');
        } catch (err) {
            console.error(err);
        }
    };

    return {
        register,
        login,
        logout,
        user,
        isLoading: isLoading,
        isAuthenticated,
        error,
    };
};