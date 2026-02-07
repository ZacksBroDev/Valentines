import { useState, useCallback, useEffect } from "react";
import {
  getFavorites,
  saveFavorites,
} from "../utils/storage";
import { allCards } from "../data/cards";

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => boolean; // Returns true if added, false if removed
  refreshFavorites: () => void;
}

// Get all valid card IDs (built-in cards)
const getValidCardIds = (): Set<string> => {
  return new Set(allCards.map(c => c.id));
};

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = getFavorites();
    const validIds = getValidCardIds();
    // Filter out any favorite IDs that don't exist in allCards
    return stored.filter(id => validIds.has(id));
  });

  // Clean up invalid favorites on mount
  useEffect(() => {
    const stored = getFavorites();
    const validIds = getValidCardIds();
    const validFavorites = stored.filter(id => validIds.has(id));
    
    // If there were invalid IDs, clean them up
    if (validFavorites.length !== stored.length) {
      saveFavorites(validFavorites);
      setFavorites(validFavorites);
    }
  }, []);

  const refreshFavorites = useCallback(() => {
    const stored = getFavorites();
    const validIds = getValidCardIds();
    setFavorites(stored.filter(id => validIds.has(id)));
  }, []);

  const checkIsFavorite = useCallback(
    (id: string): boolean => {
      return favorites.includes(id);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string): boolean => {
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
    },
    [],
  );

  return {
    favorites,
    isFavorite: checkIsFavorite,
    toggleFavorite,
    refreshFavorites,
  };
};
