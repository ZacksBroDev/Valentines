// ============================================================
// useStreaks - Hook for streak tracking
// Tracks both draw streaks and love log streaks
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { streaksApi, dailyLogApi } from "../client";
import { StreakInfo } from "../types";

interface UseStreaksReturn {
  // Data
  streaks: StreakInfo | null;
  isLoading: boolean;
  
  // Computed
  currentDrawStreak: number;
  currentLoveStreak: number;
  drewToday: boolean;
  loggedLoveToday: boolean;
  
  // Actions
  logDraw: (cardId: string) => Promise<void>;
  logLove: (message?: string) => Promise<void>;
  refreshStreaks: () => Promise<void>;
}

export const useStreaks = (): UseStreaksReturn => {
  const [streaks, setStreaks] = useState<StreakInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStreaks = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await streaksApi.getStreakInfo();
      setStreaks(info);
    } catch (err) {
      console.error("Failed to load streaks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStreaks();
  }, [refreshStreaks]);

  const logDraw = useCallback(async (cardId: string): Promise<void> => {
    try {
      // Log to daily log
      await dailyLogApi.logCard(cardId);
      
      // Update streak
      const updated = await streaksApi.logDraw(cardId);
      setStreaks(updated);
    } catch (err) {
      console.error("Failed to log draw:", err);
    }
  }, []);

  const logLove = useCallback(async (message?: string): Promise<void> => {
    try {
      const updated = await streaksApi.logLove(message);
      setStreaks(updated);
    } catch (err) {
      console.error("Failed to log love:", err);
    }
  }, []);

  return {
    streaks,
    isLoading,
    
    currentDrawStreak: streaks?.currentDrawStreak || 0,
    currentLoveStreak: streaks?.currentLoveStreak || 0,
    drewToday: streaks?.drewToday || false,
    loggedLoveToday: streaks?.loggedLoveToday || false,
    
    logDraw,
    logLove,
    refreshStreaks,
  };
};

export default useStreaks;
