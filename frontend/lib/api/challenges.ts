import axiosClient from "@/lib/axios";

/**
 * Pro debug
 */
export async function generateDailyChallenges(count?: number) {
    try {
        const res = await axiosClient.post(`api/generate/dailyChallenges`, count);
        return res.data;
    } catch (err) {
        console.error(err)
    }
}

/**
 * Pro debug
 */
export async function generateWeeklyChallenges(count?: number) {
    try {
        const res = await axiosClient.post(`api/generate/weeklyChallenges`, count);
        return res.data;
    } catch (err) {
        console.error(err)
    }
}
/**
 * Pro debug
 */
export async function generateChallenges(count? :number) {
    try {
        await generateWeeklyChallenges(count)
        await generateDailyChallenges(count)
        console.log("Výzvy se vygenerovaly úspěšně")
    } catch (err) {
        console.error(err)
    }
}

