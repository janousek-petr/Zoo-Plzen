import axiosClient from "@/lib/axios";

/**
 * Vrácí otázky konkrétního kvízu
 *
 * @param quiz_id - ID kvízu
 * @returns Pole otázek
 */
export async function getQuestions(quiz_id: number) {
    try {
        const res = await axiosClient.get(`/api/quiz/${quiz_id}`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}