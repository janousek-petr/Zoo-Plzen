import axiosClient from "@/lib/axios";
export async function getItemsInStore() {
    try {
        const res = await axiosClient.get(`/api/itemsInStore`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}