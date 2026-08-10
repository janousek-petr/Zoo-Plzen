import {apiPost} from "@/lib/api/client";
import {AxiosResponse} from "axios";

export async function addLevel(profile_id: number, level: number): Promise<AxiosResponse<any>> {
    return apiPost("/api/addLevel", { profile_id, level });
}

export async function addXp(profile_id: number, xp: number): Promise<AxiosResponse<any>> {
    return apiPost("/api/addXp", { profile_id, xp });
}