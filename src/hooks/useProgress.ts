import { useState, useCallback } from "react";
import { CONFIG, ThemeKey } from "../config";
import {
  getReasonsLogged,
  setReasonsLogged,
  getLoveMeter,
  setLoveMeter,
  isLoveMeterComplete,
  setLoveMeterComplete,
  getUnlockedThemes,
  setUnlockedThemes,
} from "../utils/storage";

export const useProgress = () => {
  const [reasonsLogged, setReasonsLoggedState] = useState(getReasonsLogged);
  const [loveMeterValue, setLoveMeterValueState] = useState(getLoveMeter);
  const [loveMeterComplete, setLoveMeterCompleteState] =
    useState(isLoveMeterComplete);
  const [unlockedThemes, setUnlockedThemesState] =
    useState<ThemeKey[]>(getUnlockedThemes);

  const logReason = useCallback(() => {
    const newCount = reasonsLogged + 1;
    setReasonsLoggedState(newCount);
    setReasonsLogged(newCount);
  }, [reasonsLogged]);

  const addLovePoints = useCallback(
    (points: number) => {
      if (loveMeterComplete) return;

      const newValue = Math.min(
        loveMeterValue + points,
        CONFIG.loveMeter.maxPoints,
      );
      setLoveMeterValueState(newValue);
      setLoveMeter(newValue);

      if (newValue >= CONFIG.loveMeter.maxPoints) {
        setLoveMeterCompleteState(true);
        setLoveMeterComplete(true);
      }
    },
    [loveMeterValue, loveMeterComplete],
  );

  const checkMilestone = useCallback((): ThemeKey | null => {
    const { milestones } = CONFIG;
    let newTheme: ThemeKey | null = null;

    if (
      reasonsLogged >= milestones.lavenderTheme &&
      !unlockedThemes.includes("lavender")
    ) {
      newTheme = "lavender";
    } else if (
      reasonsLogged >= milestones.nightTheme &&
      !unlockedThemes.includes("night")
    ) {
      newTheme = "night";
    } else if (
      reasonsLogged >= milestones.sunsetTheme &&
      !unlockedThemes.includes("sunset")
    ) {
      newTheme = "sunset";
    }

    if (newTheme) {
      const updated = [...unlockedThemes, newTheme];
      setUnlockedThemesState(updated);
      setUnlockedThemes(updated);
    }

    return newTheme;
  }, [reasonsLogged, unlockedThemes]);

  return {
    reasonsLogged,
    loveMeterValue,
    loveMeterComplete,
    unlockedThemes,
    logReason,
    addLovePoints,
    checkMilestone,
  };
};
