import { useState, useCallback, useEffect, useMemo } from "react";
import { getFavorites, saveFavorites } from "../utils/storage";
import { useCardContext } from "../context/CardContext";

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => boolean; // Returns true if added, false if removed
  refreshFavorites: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const { allCards } = useCardContext();

  // Get all valid card IDs (from API-loaded cards)
  const validCardIds = useMemo(
    () => new Set(allCards.map((c) => c.id)),
    [allCards],
  );

  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = getFavorites();
    // On first render, cards may not be loaded yet — return stored as-is
    return stored;
  });

  // Clean up invalid favorites when cards are loaded
  useEffect(() => {
    if (allCards.length === 0) return;
    const stored = getFavorites();
    const validFavorites = stored.filter((id) => validCardIds.has(id));

    if (validFavorites.length !== stored.length) {
      saveFavorites(validFavorites);
      setFavorites(validFavorites);
    }
  }, [allCards, validCardIds]);

  const refreshFavorites = useCallback(() => {
    const stored = getFavorites();
    setFavorites(stored.filter((id) => validCardIds.has(id)));
  }, [validCardIds]);

  const checkIsFavorite = useCallback(
    (id: string): boolean => {
      return favorites.includes(id);
    },
    [favorites],
  );

  const toggleFavorite = useCallback((id: string): boolean => {
    // Compute new favorites directly to ensure state stays in sync
    const currentFavorites = getFavorites();
    const idx = currentFavorites.indexOf(id);
    let newFavorites: string[];
    let wasAdded: boolean;

    if (idx > -1) {
      // Remove from favorites
      newFavorites = currentFavorites.filter((fid) => fid !== id);
      wasAdded = false;
    } else {
      // Add to favorites
      newFavorites = [...currentFavorites, id];
      wasAdded = true;
    }

    // Save to storage and update state atomically
    saveFavorites(newFavorites);
    setFavorites(newFavorites);

    return wasAdded;
  }, []);

  return {
    favorites,
    isFavorite: checkIsFavorite,
    toggleFavorite,
    refreshFavorites,
  };
};
