import axiosClient from "@/lib/axios";

export function useChallengeEvent() {
    /**
     * TODO
     * Napsat generickou metodu
     * @param event
     */
    async function sendEvent(event: {
        challenge_type: string;
        answered_quiz_id?: number;
        region_id?: number;
        profile_id: number;
        quiz_id: number
    }) {
        await axiosClient.post("/api/challenges/event", event);
    }

    /**
     * Pro kvízy
     *
     * type: "quiz_completed" – Uživatel právě dokončil jakýkoliv kvíz.
     *
     * type: "region_quiz_completed" – Uživatel právě dokončil kvíz konkrétní oblasti.
     *
     * (Spouštět na konci kvízu) type: "correct_answers" – Uživatel odpověděl správně na otázku .
     *
     * (Spouštět na konci kvízu) type: "region_correct_answers" – Uživatel odpověděl správně na otázku.
     * @param event
     */
    async function sendQuizEvent(event: {
        challenge_type?: string;
        answered_quiz_id?: number;
        region_id?: number;
        profile_id: number;
        quiz_id: number
    }) {
        const challenge_type = ["correct_answers", "region_quiz_completed", "region_correct_answers", "quiz_completed"]

        for (let i = 0; i < challenge_type.length; i++) {
            event.challenge_type = challenge_type[i];
            await axiosClient.post("/api/challenges/event", event);
        }
    }

    return { sendEvent, sendQuizEvent };
}
