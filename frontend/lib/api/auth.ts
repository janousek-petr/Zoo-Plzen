import axios from "@/lib/axios";

export interface RegisterData{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginData{
    email: string;
    password: string;
    remember?: boolean;
}


const authService = {
    csrf: async () => {
        return axios.get('/sanctum/csrf-cookie');
    },

    register: async (data : RegisterData) => {
        await authService.csrf();
        return await axios.post('/register', data);
    },

    login: async (data : LoginData) => {
        await authService.csrf();
        return await axios.post('/login', data);
    },

    logout: async () => {
        await authService.csrf();
        return await axios.post('/logout');
    },

    getUser: async () => {
        await authService.csrf();
        return await axios.get('api/user');
    },

    verifyEmail: async (url: string) => {
        return await axios.get(url);
    }
};

export default authService;

const FRIENDLY_ERRORS: Record<number, string> = {
    401: "Nesprávný email nebo heslo.",
    403: "K této akci nemáte oprávnění.",
    422: "Zkontrolujte prosím vyplněné údaje.",
    429: "Příliš mnoho pokusů. Zkuste to prosím za chvíli.",
    500: "Něco se pokazilo na naší straně. Zkuste to prosím znovu.",
    503: "Služba je momentálně nedostupná. Zkuste to prosím za chvíli.",
};

// Vzory, které prozrazují interní detaily (SQL, connection stringy, stack trace...)
const UNSAFE_PATTERNS = /SQLSTATE|Exception|Connection:|Stack trace|at\s+\/|\.php:\d+/i;

export function getFriendlyErrorMessage(err: any, fallback: string, isLogin : boolean): string {
    const status = err?.response?.status;
    const rawMessage = err?.response?.data?.message;
    const errors = err?.response?.data?.errors; // Laravel validation errors format

    // Síťová chyba / server vůbec neodpověděl (typicky vypnutý server)
    if (!err?.response) {
        return "Nepodařilo se spojit se serverem. Zkontrolujte prosím připojení a zkuste to znovu.";
    }

    // Konkrétní validační chyba: duplicitní email při registraci
    if (status === 422 && errors?.email && !isLogin) {
        return "Účet s tímto emailem už existuje. Zkuste se raději přihlásit.";
    }

    if (status && FRIENDLY_ERRORS[status]) {
        return FRIENDLY_ERRORS[status];
    }

    if (typeof rawMessage === "string" && UNSAFE_PATTERNS.test(rawMessage)) {
        return fallback;
    }

    return rawMessage ?? fallback;
}


//PODMÍNKY PRO VYTVOŘENÍ UŽIVATELE
export interface PasswordRule {
    label: string;
    test: (password: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
    { label: "Alespoň 8 znaků", test: (p) => p.length >= 8 },
    { label: "Alespoň jedno velké písmeno", test: (p) => /[A-Z]/.test(p) },
    { label: "Alespoň jedna číslice", test: (p) => /[0-9]/.test(p) },
];

export function isPasswordValid(password: string): boolean {
    return passwordRules.every((rule) => rule.test(password));
}