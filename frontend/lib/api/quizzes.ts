import axiosClient from "@/lib/axios";
import { Quiz } from "@/lib/types";

/**
 * Vrácí informace o všech kvízech
 *
 * @returns Pole informací kvízů
 */


export async function getQuestions(id: number) {
    try {
        const res = await axiosClient.get(`/api/quizzes/${id}/questions`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function getQuestion(quizId: number, questionId: number) {
    try {
        const res = await axiosClient.get(`/api/quizzes/${quizId}/questions/${questionId}`)
        return res.data
    } catch (err) {
        console.error(err)
        throw err
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

export async function getQuizzesByRegion(regionId: number, profileId?: number) {
    try {
        const res = await axiosClient.get(`/api/regions/${regionId}/quizzes`, {
            params: profileId ? { profile_id: profileId } : {}
        });
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

export async function getQuestionCategories() {
    const res = await axiosClient.get('/api/question-categories')
    return res.data
}


export async function createQuestion(quizId: number, data: {
    text: string,
    points: number,
    question_category: number,
    image?: string | null,
    answers: {
        text?: string | null,
        is_correct: boolean,
        image?: string | null,
    }[]
}) {
    try {
        const res = await axiosClient.post(`/api/quizzes/${quizId}/questions`, data)
        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateQuestion(quizId: number, questionId: number, data: {
    text: string,
    points: number,
    question_category: number,
    image?: string | null,
    answers: {
        id?: number,
        text?: string | null,
        is_correct: boolean,
        image?: string | null,
    }[]
}) {
    try {
        const res = await axiosClient.put(`/api/quizzes/${quizId}/questions/${questionId}`, data)
        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteQuestion(quizId: number, questionId: number) {
    try {
        const res = await axiosClient.delete(`/api/quizzes/${quizId}/questions/${questionId}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function togglePublishQuiz(id: number) {
    try {
        const res = await axiosClient.patch(`/api/quizzes/${id}/toggle-publish`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Proč se používá Set<T> pro vybrané odpovědi?
 * Protože ze své podstaty garantuje unikátnost prvků a automaticky zabraňuje duplicitám při opakovaném kliknutí na stejnou možnost.
 * Tato data se před odesláním na API jednoduše převedou na běžné pole přes Array.from().
 * @param data
 */
export async function submitQuizResult(data: {
    quiz_id: number,
    profile_id: number,
    score: number,
    selectedAnswers: Set<number>
}) {
    try {
        const res = await axiosClient.post(`/api/answeredQuizzes`, {
            quiz_id: data.quiz_id,
            profile_id: data.profile_id,
            score: data.score,
            selectedAnswers: Array.from(data.selectedAnswers)
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function startRandomQuiz(regionId: number, level: number) {
    const res = await axiosClient.post(`/api/quizzes/start-random`, {
        region_id: regionId,
        level,
    });
    return res.data;
}