import axiosClient from "@/lib/axios";
import { Item } from "@/lib/types";

export async function getInventory(profileId: number): Promise<Item[]> {
    try {
        const res = await axiosClient.get(`/api/profiles/${profileId}/inventory`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function equipItem(profileId: number, itemId: number) {
    try {
        const res = await axiosClient.post(`/api/profiles/${profileId}/equip`, {
            item_id: itemId,
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function giveItem(profileId: number, itemId: number) {
    try {
        const res = await axiosClient.post(`/api/profiles/${profileId}/inventory/giveItem`, {
            item_id: itemId,
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
