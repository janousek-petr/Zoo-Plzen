"use client";

import {useCallback, useEffect, useState} from "react";
import axiosClient from "@/lib/axios";

export function useChallenges(profile_id: number | undefined) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        axiosClient
            .post("/api/challenges", {"profile_id": profile_id})
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [profile_id]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, refetch };
}
