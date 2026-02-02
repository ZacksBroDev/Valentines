const STORAGE_KEYS = {
  FAVORITES: "valentine-deck-favorites",
  SECRET_UNLOCKED: "valentine-deck-secret-unlocked",
  SEEN_IDS: "valentine-deck-seen-ids",
  SOUND_MUTED: "valentine-deck-sound-muted",
  DECK_EXHAUSTED_ONCE: "valentine-deck-exhausted-once",
} as const;

// Favorites
export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
};

export const toggleFavorite = (id: string): boolean => {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    return false; // Removed
  } else {
    favorites.push(id);
    saveFavorites(favorites);
    return true; // Added
  }
};

export const isFavorite = (id: string): boolean => {
  return getFavorites().includes(id);
};

// Secret unlock
export const isSecretUnlocked = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.SECRET_UNLOCKED) === "true";
};

export const unlockSecret = (): void => {
  localStorage.setItem(STORAGE_KEYS.SECRET_UNLOCKED, "true");
};

// Seen IDs for deck exhaustion tracking
export const getSeenIds = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SEEN_IDS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveSeenIds = (ids: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.SEEN_IDS, JSON.stringify(ids));
};

export const clearSeenIds = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SEEN_IDS);
};

// Sound muted
export const isSoundMuted = (): boolean => {
  // Default to muted (OFF)
  const stored = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED);
  return stored === null ? true : stored === "true";
};

export const setSoundMuted = (muted: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(muted));
};

// Track if deck was exhausted at least once
export const wasDeckExhausted = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.DECK_EXHAUSTED_ONCE) === "true";
};

export const setDeckExhausted = (): void => {
  localStorage.setItem(STORAGE_KEYS.DECK_EXHAUSTED_ONCE, "true");
};

export const resetDeckExhausted = (): void => {
  localStorage.removeItem(STORAGE_KEYS.DECK_EXHAUSTED_ONCE);
};
