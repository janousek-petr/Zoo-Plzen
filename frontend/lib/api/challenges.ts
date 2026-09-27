import axiosClient from "@/lib/axios";
type ChallengeType = {
    period: "daily" | "weekly",
    challenge_type: string,
    title: string,
    description: string,
    reward: number,
    valid_until: string,
    media_id: number | null,
    animalSrc: string,
    animalAlt: string,
    animalSide: string,
    bgColor: string,
    region_id: number | null
}

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

/*
export async function generateChallenges(count? :number) {
    try {
        await generateWeeklyChallenges(count)
        await generateDailyChallenges(count)
        console.log("Výzvy se vygenerovaly úspěšně")
    } catch (err) {
        console.error(err)
    }
}

 */

export async function generateChallenges(period: "daily" | "weekly", count :number, validUntil: string, terminateExisting: boolean) {
    let res = null
    try {
        if (period === "weekly") {
            res = await axiosClient.post(`api/generate/weeklyChallenges`, {period, count, validFrom: validUntil, terminateExisting});
        } else {
            res = await axiosClient.post(`api/generate/dailyChallenges`, {period, count, validFrom: validUntil, terminateExisting});
        }
        console.log("Výzvy se vygenerovaly úspěšně")
        return res.data;
    } catch (err) {
        console.error(err)
    }
}

export async function getTemplates() {
    try {
        const res = await axiosClient.get(`api/admin/challenge-templates`);
        return res.data;
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export async function createChallenge(data: ChallengeType) {
    try {
        const res = await axiosClient.post(`api/admin/active-challenges`, data);
        return res.data;
    } catch (err) {
        console.error(err)
        throw err;
    }
}

// Načtení jedné konkrétní výzvy podle ID
export async function getChallenge(id: string | number) {
    const response = await axiosClient.get(`/api/challenges/${id}`);
    return response.data;
}

// Úprava existující výzvy
export async function updateChallenge(id: string | number, data: any) {
    const response = await axiosClient.put(`/api/challenges/${id}`, data);
    return response.data;
}

export async function deleteChallenge(id: number) {
    try {
        const res = await axiosClient.delete(`/api/admin/active-challenges/${id}`);
    } catch (err) {
        throw err;
    }
}
