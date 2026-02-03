import { useState, useCallback, useMemo } from "react";
import { THEMES, ThemeKey } from "../config";
import {
  getCurrentTheme,
  setCurrentTheme as saveCurrentTheme,
} from "../utils/storage";

// Hook that accepts unlockedThemes from useProgress to stay in sync
export const useTheme = (externalUnlockedThemes?: ThemeKey[]) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeKey>(getCurrentTheme);
  
  // Default to blush if no external themes provided
  const unlockedThemes = externalUnlockedThemes ?? ["blush"];

  const setTheme = useCallback((theme: ThemeKey) => {
    if (unlockedThemes.includes(theme)) {
      setCurrentThemeState(theme);
      saveCurrentTheme(theme);
    }
  }, [unlockedThemes]);

  const isThemeUnlocked = useCallback(
    (theme: ThemeKey) => unlockedThemes.includes(theme),
    [unlockedThemes]
  );

  const themeStyles = useMemo(() => THEMES[currentTheme], [currentTheme]);

  const isDarkTheme = currentTheme === "night";

  return {
    currentTheme,
    unlockedThemes,
    themeStyles,
    isDarkTheme,
    setTheme,
    isThemeUnlocked,
  };
};
