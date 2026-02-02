import { useState, useCallback } from "react";
import {
  getFavorites,
  toggleFavorite as storageToggleFavorite,
  isFavorite,
} from "../utils/storage";

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => boolean; // Returns true if added, false if removed
  refreshFavorites: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());

  const refreshFavorites = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  const checkIsFavorite = useCallback(
    (id: string): boolean => {
      return favorites.includes(id);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string): boolean => {
      const wasAdded = storageToggleFavorite(id);
      refreshFavorites();
      return wasAdded;
    },
    [refreshFavorites],
  );

  return {
    favorites,
    isFavorite: checkIsFavorite,
    toggleFavorite,
    refreshFavorites,
  };
};
