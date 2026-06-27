import axiosClient from "@/lib/axios";
import { RegionInfo } from "@/lib/types";

/**
 * Vrácí plochý seznam všech textů (volitelně filtrovaný podle regionu)
 *
 * @returns Pole textů
 */
export async function getTexts(regionId?: number) {
    try {
        const res = await axiosClient.get(`/api/region-infos`, {
            params: regionId ? { region_id: regionId } : {}
        });
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

/**
 * Vrácí texty pro daný region, rozdělené podle úrovně
 * { "1": [...], "2": [...], "3": [...] }
 */
export async function getTextsByRegion(regionId: number) {
    try {
        const res = await axiosClient.get(`/api/regions/${regionId}/infos`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function getText(id: number) {
    try {
        const res = await axiosClient.get(`/api/region-infos/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function createText(data: {
    region_id: number,
    level: number,
    text: string,
}) {
    try {
        const res = await axiosClient.post(`/api/region-infos`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updateText(id: number, data: Partial<RegionInfo>) {
    try {
        const res = await axiosClient.put(`/api/region-infos/${id}`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteText(id: number) {
    try {
        const res = await axiosClient.delete(`/api/region-infos/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}