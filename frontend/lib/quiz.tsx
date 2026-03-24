import axiosClient from "@/lib/axios";

/**
 * Vrácí informace o všech kvízech
 *
 * @returns Pole informací kvízů
 */
export async function getQuizInfo() {
    try {
        const res = await axiosClient.get(`/api/quizInfo`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}