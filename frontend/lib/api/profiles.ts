import axios from "@/lib/axios";
import type { Profile } from "@/lib/types";

const profileService = {
    getAll: async () => {
        return await axios.get<Profile[]>('/api/profiles');
    },
    create: async (data: Partial<Profile>) => {
        return await axios.post<Profile>('/api/profiles', data);
    },
    update: async (id: number, data: Partial<Profile>) => {
        return await axios.put<Profile>(`/api/profiles/${id}`, data);
    },
    destroy: async (id: number) => {
        return await axios.delete(`/api/profiles/${id}`);
    },
};

export default profileService;