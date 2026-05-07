import axiosClient from "@/lib/axios";
import { Quiz } from "@/lib/types";

/**
 * Vrácí informace o všech kvízech
 *
 * @returns Pole informací kvízů
 */


export async function getQuestions(quizId: number) {
    try {
        const res = await axiosClient.get(`/api/quiz/${quizId}`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function getRegions() {
    try {
        const res = await axiosClient.get(`/api/regions`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function getQuizzes() {
    try {
        const res = await axiosClient.get(`/api/quizzes`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function getQuizzesByRegion(regionId: number) {
    try {
        const res = await axiosClient.get(`/api/regions/${regionId}/quizzes`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function createQuiz(data: {
    name: string,
    description?: string,
    region_id?: number,
    level?: number,
}) {
    try {
        const res = await axiosClient.post(`/api/quizzes`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updateQuiz(id: number, data: Partial<Quiz>) {
    try {
        const res = await axiosClient.put(`/api/quizzes/${id}`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteQuiz(id: number) {
    try {
        const res = await axiosClient.delete(`/api/quizzes/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getQuiz(id: number) {
    try {
        const res = await axiosClient.get(`/api/quizzes/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}