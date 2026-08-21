import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService, { RegisterData, LoginData } from '@/lib/api/auth';
import { useAuthContext } from '@/contexts/AuthContext';
import { getFriendlyErrorMessage } from '@/lib/api/auth';

const useAuth = () => {
    const router = useRouter();
    const { refreshUser, logout: contextLogout, user, isLoading: contextLoading, isAuthenticated, isVerified } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.register(data);
            const registredUser = await refreshUser();

            if (registredUser && registredUser.email_verified_at === null) {
                router.replace('/overeni-emailu')
                return;
            }

            router.replace('/zvoleni-profilu');
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
            const freshUser = await refreshUser();

            if (freshUser && freshUser.email_verified_at === null) {
                sessionStorage.setItem("pendingEmailResend", "true");
                router.push('/overeni-emailu');
                return;
            }

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

    const resendVerificationEmail = async () => {
        if (!user || isVerified)
            return;
        setError(null);
        setIsLoading(true);
        try {
            await authService.resendVerificationEmail();
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        register,
        login,
        logout,
        resendVerificationEmail,
        user,
        isLoading: isLoading,
        isAuthenticated,
        error,
    };
};
export default useAuth