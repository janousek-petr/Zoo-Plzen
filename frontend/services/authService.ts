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