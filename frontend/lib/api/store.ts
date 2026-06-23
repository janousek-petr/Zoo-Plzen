import axiosClient from "@/lib/axios";
import { Item } from "@/lib/types";

// Backend vrací ItemsInStore záznamy, zanořený item obsahuje detail předmětu
export type StoreOffer = {
    id: number;
    store_id: number;
    item_id: number;
    arrival_date: string;
    leave_date: string | null;
    item: Item;
};

export async function getStore(profileId: number): Promise<StoreOffer[]> {
    try {
        const res = await axiosClient.get(`/api/profiles/${profileId}/store`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function buyItem(profileId: number, itemId: number) {
    try {
        const res = await axiosClient.post(`/api/profiles/${profileId}/store/buy`, {
            item_id: itemId,
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}