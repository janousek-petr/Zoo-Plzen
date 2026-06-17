import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import profileService from "@/lib/api/profiles";
import type { Profile } from "@/lib/types";

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  update: (data: Partial<Profile>) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { activeProfile, setActiveProfile } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(activeProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!activeProfile?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.getOne(activeProfile.id);
      setProfile(response.data);
      setActiveProfile(response.data);
    } catch {
      setError("Nepodařilo se načíst profil.");
    } finally {
      setIsLoading(false);
    }
  }, [activeProfile?.id]);

  useEffect(() => {
    refresh();
  }, [activeProfile?.id]);

  const update = useCallback(async (data: Partial<Profile>) => {
    if (!profile?.id) return;

    const previous = profile;
    const optimistic = { ...profile, ...data };
    setProfile(optimistic);
    setActiveProfile(optimistic);

    setIsSaving(true);
    setError(null);
    try {
      const response = await profileService.update(profile.id, data);
      setProfile(response.data);
      setActiveProfile(response.data);
    } catch {
      setProfile(previous);
      setActiveProfile(previous);
      setError("Uložení se nezdařilo. Zkus to znovu.");
    } finally {
      setIsSaving(false);
    }
  }, [profile]);

  return { profile, isLoading, isSaving, error, update, refresh };
}