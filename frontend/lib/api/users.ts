import axios from "@/lib/axios";
import type { User, Profile } from "@/lib/types";

export type CreateUserResponse = {
    user: User;
    generated_password: string;
}

const userService = {
    getAll: async () => {
        return await axios.get<User[]>('/api/users');
    },
    getOne: async (id: number) => {
        return await axios.get<User>(`/api/users/${id}`);
    },
    create: async (data: Partial<User>) => {
        return await axios.post<CreateUserResponse>('/api/users', data);
    },
    update: async (id: number, data: Partial<User>) => {
        return await axios.put<User>(`/api/users/${id}`, data);
    },
    destroy: async (id: number) => {
        return await axios.delete(`/api/users/${id}`);
    },

    profiles: {
        getAll: async (userId: number) => {
            return await axios.get<Profile[]>(`/api/users/${userId}/profiles`);
        },
        destroy: async (userId: number, profileId: number) => {
            return await axios.delete(`/api/users/${userId}/profiles/${profileId}`);
        },
    }
};

export default userService;