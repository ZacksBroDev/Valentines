import { useState, useCallback, useRef } from "react";

interface UseRapidTapReturn {
  handleTap: () => boolean; // Returns true if threshold reached
  reset: () => void;
}

export const useRapidTap = (
  requiredTaps: number = 5,
  maxDuration: number = 3000,
): UseRapidTapReturn => {
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setTapTimestamps([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleTap = useCallback((): boolean => {
    const now = Date.now();

    // Clear old timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Filter out old taps outside the duration window
    const recentTaps = tapTimestamps.filter((t) => now - t <= maxDuration);
    const newTaps = [...recentTaps, now];

    setTapTimestamps(newTaps);

    // Set timeout to reset if no more taps
    timeoutRef.current = setTimeout(() => {
      setTapTimestamps([]);
    }, maxDuration);

    // Check if we've reached the threshold
    if (newTaps.length >= requiredTaps) {
      const duration = newTaps[newTaps.length - 1] - newTaps[0];
      if (duration <= maxDuration) {
        reset();
        return true;
      }
    }

    return false;
  }, [tapTimestamps, requiredTaps, maxDuration, reset]);

  return { handleTap, reset };
};
