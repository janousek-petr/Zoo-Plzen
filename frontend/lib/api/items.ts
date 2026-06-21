import axiosClient from "@/lib/axios";
import { Item } from "@/lib/types";

export async function getItems() {
    try {
        const res = await axiosClient.get('/api/items');
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getItem(id: number) {
    try {
        const res = await axiosClient.get(`/api/items/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function createItem(data: {
    name: string;
    price?: number;
    description?: string | null;
    image?: string | null;
    item_unlock_level?: number | null;
    category_id: number;
}) {
    try {
        const res = await axiosClient.post('/api/items', data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updateItem(id: number, data: Partial<Item>) {
    try {
        const res = await axiosClient.put(`/api/items/${id}`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteItem(id: number) {
    try {
        const res = await axiosClient.delete(`/api/items/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getItemCategories() {
    try {
        const res = await axiosClient.get('/api/item-categories');
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}