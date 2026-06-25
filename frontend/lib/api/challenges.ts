import axiosClient from "@/lib/axios";

/**
 * Pro debug
 */
export async function generateDailyChallenges() {
    try {
        const res = await axiosClient.post(`api/generate/dailyChallenges`, 3);
        return res.data;
    } catch (err) {
        console.error(err)
    }
}

/**
 * Pro debug
 */
export async function generateWeeklyChallenges() {
    try {
        const res = await axiosClient.post(`api/generate/weeklyChallenges`, 3);
        return res.data;
    } catch (err) {
        console.error(err)
    }
}
/**
 * Pro debug
 */
export async function generateChallenges() {
    try {
        await generateWeeklyChallenges()
        await generateDailyChallenges()
        console.log("Výzvy se vygenerovaly úspěšně")
    } catch (err) {
        console.error(err)
    }
}

