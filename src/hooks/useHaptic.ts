import { useCallback } from "react";

type VibrationPattern = "short" | "medium" | "long" | "double" | number | number[];

const PATTERNS: Record<string, number | number[]> = {
  short: 10,
  medium: 25,
  long: 50,
  double: [10, 50, 10],
};

export const useHaptic = () => {
  const vibrate = useCallback((pattern: VibrationPattern = "short") => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        const p = typeof pattern === "string" ? PATTERNS[pattern] || 10 : pattern;
        navigator.vibrate(p);
      } catch {
        // Silently fail on unsupported devices
      }
    }
  }, []);

  return { vibrate };
};
