import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";

export function useChallenges(userId: number | undefined) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient
            .post("/api/challenges", {"profile_id": userId})
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [userId]);

    return { data, loading };
}
